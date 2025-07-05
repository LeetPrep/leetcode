// Search functionality for LeetPrep
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.allProblems = [];
        this.searchTimeout = null;
        
        this.init();
    }

    init() {
        this.loadProblems();
        this.setupEventListeners();
    }

    loadProblems() {
        this.allProblems = JSON.parse(localStorage.getItem('leetprep_problems') || '[]');
    }

    setupEventListeners() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Clear previous timeout
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            
            // Debounce search
            this.searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    this.performSearch(query);
                } else {
                    this.hideResults();
                }
            }, 300);
        });

        this.searchInput.addEventListener('focus', () => {
            const query = this.searchInput.value.trim();
            if (query.length >= 2) {
                this.performSearch(query);
            }
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });

        // Handle keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            const activeResult = this.searchResults.querySelector('.search-result-item.active');
            const allResults = this.searchResults.querySelectorAll('.search-result-item');
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (!activeResult) {
                        allResults[0]?.classList.add('active');
                    } else {
                        const next = activeResult.nextElementSibling;
                        if (next) {
                            activeResult.classList.remove('active');
                            next.classList.add('active');
                        }
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (activeResult) {
                        const prev = activeResult.previousElementSibling;
                        if (prev) {
                            activeResult.classList.remove('active');
                            prev.classList.add('active');
                        } else {
                            activeResult.classList.remove('active');
                        }
                    }
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (activeResult) {
                        activeResult.click();
                    }
                    break;
                    
                case 'Escape':
                    this.hideResults();
                    this.searchInput.blur();
                    break;
            }
        });
    }

    performSearch(query) {
        const results = this.searchProblems(query);
        this.displayResults(results, query);
    }

    searchProblems(query) {
        const lowerQuery = query.toLowerCase();
        
        return this.allProblems
            .filter(problem => {
                // Search in title, number, description, and languages
                const titleMatch = problem.title.toLowerCase().includes(lowerQuery);
                const numberMatch = problem.number.toString().includes(query);
                const descriptionMatch = problem.description?.toLowerCase().includes(lowerQuery);
                const languageMatch = problem.languages.some(lang => 
                    lang.toLowerCase().includes(lowerQuery)
                );
                
                return titleMatch || numberMatch || descriptionMatch || languageMatch;
            })
            .slice(0, 8) // Limit to 8 results
            .map(problem => ({
                ...problem,
                relevance: this.calculateRelevance(problem, lowerQuery)
            }))
            .sort((a, b) => b.relevance - a.relevance);
    }

    calculateRelevance(problem, query) {
        let score = 0;
        const title = problem.title.toLowerCase();
        const description = (problem.description || '').toLowerCase();
        
        // Exact title match gets highest score
        if (title === query) score += 100;
        
        // Title starts with query
        else if (title.startsWith(query)) score += 80;
        
        // Title contains query
        else if (title.includes(query)) score += 60;
        
        // Number match
        if (problem.number.toString() === query) score += 90;
        else if (problem.number.toString().includes(query)) score += 70;
        
        // Description match
        if (description.includes(query)) score += 30;
        
        // Language match
        if (problem.languages.some(lang => lang.toLowerCase().includes(query))) {
            score += 40;
        }
        
        // Boost recent problems
        const daysSincePublish = (Date.now() - new Date(problem.publishDate)) / (1000 * 60 * 60 * 24);
        if (daysSincePublish < 30) score += 10;
        
        return score;
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-result-item">
                    <div class="search-result-title">No problems found</div>
                    <div class="search-result-meta">Try a different search term</div>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = results.map(problem => `
                <div class="search-result-item" onclick="searchManager.openProblem(${problem.number})">
                    <div class="search-result-title">
                        #${problem.number}: ${this.highlightMatch(problem.title, query)}
                    </div>
                    <div class="search-result-meta">
                        <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span> • 
                        ${problem.languages.join(', ')} • 
                        ${new Date(problem.publishDate).toLocaleDateString()}
                    </div>
                </div>
            `).join('');
        }
        
        this.showResults();
    }

    highlightMatch(text, query) {
        if (!query) return this.escapeHtml(text);
        
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
    }

    showResults() {
        this.searchResults.style.display = 'block';
    }

    hideResults() {
        this.searchResults.style.display = 'none';
    }

    openProblem(problemNumber) {
        this.hideResults();
        this.searchInput.value = '';
        window.open(`problem.html?id=${problemNumber}`, '_blank');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Global search manager instance
let searchManager;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    searchManager = new SearchManager();
    
    // Secret admin access - Ctrl+Shift+A
    let keySequence = [];
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            window.open('leetprep-admin-portal-2025.html', '_blank');
        }
    });
});

// Add CSS for search highlighting
const style = document.createElement('style');
style.textContent = `
    .search-result-item mark {
        background: var(--text-accent);
        color: var(--bg-primary);
        padding: 0.125rem 0.25rem;
        border-radius: 2px;
    }
    
    .search-result-item.active {
        background: var(--bg-primary) !important;
    }
`;
document.head.appendChild(style);
