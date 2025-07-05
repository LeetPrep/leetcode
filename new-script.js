// New LeetPrep Website JavaScript - Dynamic Problem Loading
class LeetPrepWebsite {
    constructor() {
        this.problems = [];
        this.currentProblemIndex = 0;
        this.problemsPerPage = 3; // Show only 3 recent problems on home page
        this.init();
    }

    init() {
        this.loadProblems();
        this.updateStats();
        this.loadRecentProblems();
        this.setupMobileMenu();
    }

    loadProblems() {
        // Load problems from localStorage (created via admin panel)
        this.problems = JSON.parse(localStorage.getItem('leetprep_problems') || '[]');
        
        // Sort by publish date (most recent first)
        this.problems.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    }

    loadRecentProblems() {
        const container = document.getElementById('problemsGrid');
        if (!container) return;

        if (this.problems.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <h3>No problems available yet</h3>
                    <p>Problems will appear here once they're added.</p>
                </div>
            `;
            return;
        }

        // Show only the 3 most recent problems
        const recentProblems = this.problems.slice(0, this.problemsPerPage);
        
        container.innerHTML = recentProblems.map(problem => 
            this.createProblemCardHTML(problem)
        ).join('');

        // Add click listeners
        container.querySelectorAll('.problem-card').forEach((card, index) => {
            const problem = recentProblems[index];
            card.addEventListener('click', () => this.openProblem(problem.number));
        });
    }

    createProblemCardHTML(problem) {
        const publishDate = new Date(problem.publishDate);
        const timeAgo = this.getTimeAgo(publishDate);
        
        return `
            <div class="problem-card">
                <div class="problem-header">
                    <span class="problem-number">#${problem.number}</span>
                    <div class="problem-badges">
                        <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
                    </div>
                </div>
                <h3 class="problem-title">${this.escapeHtml(problem.title)}</h3>
                <p class="problem-description">${this.escapeHtml(problem.description || 'Click to view detailed solution and explanation.')}</p>
                <div class="problem-languages">
                    ${problem.languages.map(lang => 
                        `<span class="language-tag">${lang}</span>`
                    ).join('')}
                </div>
                <div class="problem-meta">
                    <span class="publish-date">📅 ${timeAgo}</span>
                    <span class="watch-indicator">🎥 Watch & Learn</span>
                </div>
            </div>
        `;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    }

    openProblem(problemNumber) {
        window.open(`problem.html?id=${problemNumber}`, '_blank');
    }

    updateStats() {
        // Update dynamic stats
        const totalProblems = this.problems.length;
        
        // Animate counters
        this.animateCounter('problemsSolved', totalProblems);
        this.animateCounter('totalLanguages', 3);
        
        // Mock stats for views and subscribers (you can replace with real data)
        this.animateCounter('totalViews', 15420);
        this.animateCounter('subscribers', 2840);
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas
            element.textContent = Math.floor(current).toLocaleString();
        }, duration / steps);
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const nav = document.querySelector('.nav');
        
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new LeetPrepWebsite();
});
