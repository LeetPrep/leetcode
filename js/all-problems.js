// All Problems Page Handler
class AllProblemsPage {
    constructor() {
        this.currentSort = 'id';
        this.currentOrder = 'asc';
        this.currentFilters = {
            difficulty: '',
            tags: [],
            search: ''
        };
        this.currentPage = 1;
        this.itemsPerPage = 10;
        
        this.init();
    }

    init() {
        // Wait for problems to be loaded
        if (window.problemsManager.problemsLoaded) {
            this.renderPage();
        } else {
            document.addEventListener('problemsLoaded', () => {
                this.renderPage();
            });
        }
        
        this.setupEventListeners();
    }

    renderPage() {
        this.renderStats();
        this.renderFilters();
        this.renderProblemsTable();
        this.renderPagination();
    }

    renderStats() {
        const stats = window.problemsManager.getProblemStats();
        const statsContainer = document.getElementById('problems-stats');
        
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total Problems</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.easy}</div>
                <div class="stat-label">Easy</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.medium}</div>
                <div class="stat-label">Medium</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.hard}</div>
                <div class="stat-label">Hard</div>
            </div>
        `;
    }

    renderFilters() {
        const stats = window.problemsManager.getProblemStats();
        const filtersContainer = document.getElementById('filters-container');
        
        if (!filtersContainer) return;

        filtersContainer.innerHTML = `
            <div class="filter-group">
                <label for="difficulty-filter">Difficulty:</label>
                <select id="difficulty-filter">
                    <option value="">All Difficulties</option>
                    <option value="easy">Easy (${stats.easy})</option>
                    <option value="medium">Medium (${stats.medium})</option>
                    <option value="hard">Hard (${stats.hard})</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="search-filter">Search:</label>
                <input type="text" id="search-filter" placeholder="Search by title, tags, or description...">
            </div>
            
            <div class="filter-group">
                <button id="reset-filters" class="btn btn-outline">Reset Filters</button>
            </div>
        `;
    }

    renderProblemsTable() {
        const allProblems = this.getFilteredAndSortedProblems();
        const tableBody = document.getElementById('problems-table-body');
        
        if (!tableBody) return;

        if (allProblems.length === 0) {
            tableBody.innerHTML = `
                <div class="empty-state">
                    <h3>No problems found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            this.updatePaginationVisibility(false);
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(allProblems.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentPageProblems = allProblems.slice(startIndex, endIndex);

        // Render current page problems
        tableBody.innerHTML = currentPageProblems.map(problem => 
            window.problemsManager.generateProblemRow(problem)
        ).join('');

        // Update results count
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            const total = window.problemsManager.getAllProblems().length;
            resultsCount.textContent = allProblems.length === total 
                ? `Showing ${currentPageProblems.length} of ${total} problems`
                : `Showing ${currentPageProblems.length} of ${allProblems.length} filtered problems`;
        }

        // Update pagination info
        const paginationInfo = document.getElementById('pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        }

        this.updatePaginationVisibility(totalPages > 1);
        this.renderPagination();
    }

    getFilteredAndSortedProblems() {
        let problems = window.problemsManager.getAllProblems();

        // Apply filters
        if (this.currentFilters.difficulty) {
            problems = problems.filter(p => 
                p.difficulty.toLowerCase() === this.currentFilters.difficulty
            );
        }

        if (this.currentFilters.search) {
            problems = window.problemsManager.searchProblems(this.currentFilters.search);
        }

        // Apply sorting
        problems.sort((a, b) => {
            let aValue, bValue;

            switch (this.currentSort) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'difficulty':
                    const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
                    aValue = difficultyOrder[a.difficulty.toLowerCase()];
                    bValue = difficultyOrder[b.difficulty.toLowerCase()];
                    break;
                case 'date':
                    aValue = new Date(a.publishDate);
                    bValue = new Date(b.publishDate);
                    break;
                default: // 'id'
                    aValue = a.id;
                    bValue = b.id;
            }

            if (aValue < bValue) return this.currentOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.currentOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return problems;
    }

    setupEventListeners() {
        // Sort buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-sort]')) {
                const sortBy = e.target.getAttribute('data-sort');
                this.handleSort(sortBy);
            }
        });

        // Filters
        document.addEventListener('change', (e) => {
            if (e.target.id === 'difficulty-filter') {
                this.currentFilters.difficulty = e.target.value;
                this.resetPagination();
                this.renderProblemsTable();
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.id === 'search-filter') {
                // Debounce search
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.currentFilters.search = e.target.value.trim();
                    this.resetPagination();
                    this.renderProblemsTable();
                }, 300);
            }
        });

        // Reset filters
        document.addEventListener('click', (e) => {
            if (e.target.id === 'reset-filters') {
                this.resetFilters();
            }
        });
    }

    handleSort(sortBy) {
        if (this.currentSort === sortBy) {
            // Toggle order if same column
            this.currentOrder = this.currentOrder === 'asc' ? 'desc' : 'asc';
        } else {
            // New column, default to ascending
            this.currentSort = sortBy;
            this.currentOrder = 'asc';
        }

        // Update UI indicators
        this.updateSortIndicators();
        this.renderProblemsTable();
    }

    updateSortIndicators() {
        document.querySelectorAll('[data-sort]').forEach(btn => {
            btn.classList.remove('sort-asc', 'sort-desc');
            if (btn.getAttribute('data-sort') === this.currentSort) {
                btn.classList.add(`sort-${this.currentOrder}`);
            }
        });
    }

    renderPagination() {
        const allProblems = this.getFilteredAndSortedProblems();
        const totalPages = Math.ceil(allProblems.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('pagination-container');
        
        if (!paginationContainer || totalPages <= 1) return;

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="window.allProblemsPage.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                ‹ Prev
            </button>
        `;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page and ellipsis
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="window.allProblemsPage.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-info">...</span>`;
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="window.allProblemsPage.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        // Last page and ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-info">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="window.allProblemsPage.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="window.allProblemsPage.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                Next ›
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    updatePaginationVisibility(visible) {
        const paginationContainer = document.getElementById('pagination-container');
        if (paginationContainer) {
            paginationContainer.style.display = visible ? 'flex' : 'none';
        }
    }

    goToPage(page) {
        const allProblems = this.getFilteredAndSortedProblems();
        const totalPages = Math.ceil(allProblems.length / this.itemsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderProblemsTable();
        
        // Scroll to top of table
        const problemsTable = document.querySelector('.problems-table');
        if (problemsTable) {
            problemsTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    resetFilters() {
        this.currentFilters = {
            difficulty: '',
            tags: [],
            search: ''
        };

        // Reset form elements
        const difficultyFilter = document.getElementById('difficulty-filter');
        const searchFilter = document.getElementById('search-filter');
        
        if (difficultyFilter) difficultyFilter.value = '';
        if (searchFilter) searchFilter.value = '';

        this.resetPagination();
        this.renderProblemsTable();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.allProblemsPage = new AllProblemsPage();
});
