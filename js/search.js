// Enhanced Search functionality for LeetPrep
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchTimeout = null;
        this.isSearchVisible = false;
        
        this.init();
    }

    init() {
        if (!this.searchInput) return;
        
        // Wait for problems to be loaded
        if (window.problemsManager.problemsLoaded) {
            this.setupEventListeners();
        } else {
            document.addEventListener('problemsLoaded', () => {
                this.setupEventListeners();
            });
        }
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
            if (!this.isSearchVisible) return;

            const results = this.searchResults.querySelectorAll('.search-result-item');
            const activeResult = this.searchResults.querySelector('.search-result-item.active');
            let activeIndex = -1;

            if (activeResult) {
                activeIndex = Array.from(results).indexOf(activeResult);
            }

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    activeIndex = Math.min(activeIndex + 1, results.length - 1);
                    this.updateActiveResult(results, activeIndex);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    activeIndex = Math.max(activeIndex - 1, -1);
                    this.updateActiveResult(results, activeIndex);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (activeResult) {
                        const link = activeResult.querySelector('a');
                        if (link) link.click();
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
        const results = window.problemsManager.searchProblems(query);
        this.displayResults(results, query);
    }

    displayResults(problems, query) {
        if (problems.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>No problems found for "${query}"</p>
                    <small>Try searching with different keywords</small>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = problems.slice(0, 5).map(problem => 
                this.createSearchResultItem(problem, query)
            ).join('');
        }
        
        this.showResults();
    }

    createSearchResultItem(problem, query) {
        const highlightedTitle = this.highlightSearchTerm(problem.title, query);
        const highlightedDescription = this.highlightSearchTerm(
            problem.description.substring(0, 100) + '...', 
            query
        );
        
        return `
            <div class="search-result-item" data-id="${problem.id}">
                <a href="${problem.url}">
                    <div class="search-result-header">
                        <span class="search-result-number">${problem.id}</span>
                        <span class="search-result-title">${highlightedTitle}</span>
                        <span class="search-result-difficulty ${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
                    </div>
                    <div class="search-result-description">${highlightedDescription}</div>
                    <div class="search-result-tags">
                        ${problem.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </a>
            </div>
        `;
    }

    highlightSearchTerm(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    updateActiveResult(results, activeIndex) {
        results.forEach((result, index) => {
            result.classList.toggle('active', index === activeIndex);
        });
    }

    showResults() {
        this.searchResults.style.display = 'block';
        this.isSearchVisible = true;
    }

    hideResults() {
        this.searchResults.style.display = 'none';
        this.isSearchVisible = false;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.searchManager = new SearchManager();
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        nav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    // Secret admin access - Ctrl+Shift+A
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
        font-weight: 600;
    }
    
    .search-result-item.active {
        background: var(--bg-primary) !important;
    }
    
    .search-no-results {
        padding: 1.5rem;
        text-align: center;
        color: var(--text-secondary);
    }
    
    .search-no-results small {
        opacity: 0.7;
        font-size: 0.8rem;
    }
    
    .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);
