// Problems Manager - Central registry for all problems
class ProblemsManager {
    constructor() {
        this.problems = [];
        this.problemsLoaded = false;
        this.init();
    }

    async init() {
        await this.loadProblems();
    }

    async loadProblems() {
        try {
            // Load all problem configurations
            const problemSlugs = await this.discoverProblems();
            
            const problemPromises = problemSlugs.map(async (slug) => {
                try {
                    const response = await fetch(`./problems/${slug}/config.json`);
                    if (response.ok) {
                        const config = await response.json();
                        config.slug = slug;
                        config.url = `./problems/${slug}/index.html`;
                        return config;
                    }
                } catch (error) {
                    console.warn(`Failed to load problem: ${slug}`, error);
                }
                return null;
            });

            const loadedProblems = await Promise.all(problemPromises);
            this.problems = loadedProblems
                .filter(problem => problem !== null)
                .sort((a, b) => a.id - b.id);

            this.problemsLoaded = true;
            this.dispatchLoadedEvent();
        } catch (error) {
            console.error('Error loading problems:', error);
        }
    }

    async discoverProblems() {
        // For now, we'll maintain a manual list of problem slugs
        // In a real implementation with a backend, this would be dynamic
        return [
            // Add your problem slugs here as you create them
            // Example: 'your-problem-slug'
        ];
    }

    dispatchLoadedEvent() {
        const event = new CustomEvent('problemsLoaded', {
            detail: { problems: this.problems }
        });
        document.dispatchEvent(event);
    }

    getAllProblems() {
        return this.problems;
    }

    getProblemById(id) {
        return this.problems.find(problem => problem.id === id);
    }

    getProblemBySlug(slug) {
        return this.problems.find(problem => problem.slug === slug);
    }

    getRecentProblems(count = 3) {
        return this.problems
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
            .slice(0, count);
    }

    searchProblems(query) {
        if (!query || query.trim() === '') {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();
        
        return this.problems.filter(problem => {
            const searchableText = [
                problem.title,
                problem.description,
                problem.difficulty,
                ...problem.tags,
                ...problem.languages,
                problem.id.toString()
            ].join(' ').toLowerCase();

            return searchableText.includes(searchTerm);
        }).sort((a, b) => {
            // Prioritize title matches
            const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
            const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
            
            if (aTitleMatch && !bTitleMatch) return -1;
            if (!aTitleMatch && bTitleMatch) return 1;
            
            return a.id - b.id;
        });
    }

    getFilteredProblems(filters = {}) {
        let filteredProblems = [...this.problems];

        if (filters.difficulty) {
            filteredProblems = filteredProblems.filter(
                problem => problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
            );
        }

        if (filters.tags && filters.tags.length > 0) {
            filteredProblems = filteredProblems.filter(
                problem => filters.tags.some(tag => 
                    problem.tags.some(problemTag => 
                        problemTag.toLowerCase().includes(tag.toLowerCase())
                    )
                )
            );
        }

        if (filters.language) {
            filteredProblems = filteredProblems.filter(
                problem => problem.languages.some(lang => 
                    lang.toLowerCase().includes(filters.language.toLowerCase())
                )
            );
        }

        return filteredProblems;
    }

    getProblemStats() {
        const stats = {
            total: this.problems.length,
            easy: 0,
            medium: 0,
            hard: 0,
            tags: new Set(),
            languages: new Set()
        };

        this.problems.forEach(problem => {
            // Count by difficulty
            stats[problem.difficulty.toLowerCase()]++;
            
            // Collect unique tags
            problem.tags.forEach(tag => stats.tags.add(tag));
            
            // Collect unique languages
            problem.languages.forEach(lang => stats.languages.add(lang));
        });

        // Convert Sets to Arrays
        stats.tags = Array.from(stats.tags).sort();
        stats.languages = Array.from(stats.languages).sort();

        return stats;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date; // Don't use Math.abs - we need to know if it's past or future
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If date is in the future, just show the date
        if (diffTime < 0) {
            return date.toLocaleDateString();
        }

        if (diffDays === 0) {
            return 'today';
        } else if (diffDays === 1) {
            return 'yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    }

    generateProblemCard(problem) {
        const timeAgo = this.formatDate(problem.publishDate);
        const difficultyClass = problem.difficulty.toLowerCase();
        
        return `
            <div class="problem-card" data-id="${problem.id}">
                <div class="problem-card-header">
                    <div class="problem-number">${problem.id}</div>
                    <div class="problem-difficulty ${difficultyClass}">${problem.difficulty}</div>
                </div>
                <h3 class="problem-title">
                    <a href="${problem.url}">${problem.title}</a>
                </h3>
                <p class="problem-description">${problem.description}</p>
                <div class="problem-meta">
                    <div class="problem-tags">
                        ${problem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="problem-date">${timeAgo}</div>
                </div>
                <div class="problem-actions">
                    <a href="${problem.url}" class="btn btn-primary">Solve Problem</a>
                    ${problem.videoUrl ? `<a href="${problem.videoUrl}" class="btn btn-outline" target="_blank" rel="noopener">Watch Video</a>` : ''}
                </div>
            </div>
        `;
    }

    generateProblemRow(problem) {
        const timeAgo = this.formatDate(problem.publishDate);
        const difficultyClass = problem.difficulty.toLowerCase();
        
        return `
            <div class="table-row" data-id="${problem.id}" onclick="window.location.href='${problem.url}'">
                <div class="problem-number">${problem.id}</div>
                <div class="problem-title">
                    <a href="${problem.url}" onclick="event.stopPropagation()">${problem.title}</a>
                </div>
                <div class="problem-difficulty ${difficultyClass}">${problem.difficulty}</div>
                <div class="problem-tags">
                    ${problem.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    ${problem.tags.length > 2 ? `<span class="tag-more">+${problem.tags.length - 2}</span>` : ''}
                </div>
                <div class="problem-date">${timeAgo}</div>
            </div>
        `;
    }
}

// Create global instance
window.problemsManager = new ProblemsManager();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProblemsManager;
}
