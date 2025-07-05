// All Problems Page JavaScript
class AllProblemsManager {
    constructor() {
        this.allProblems = [];
        this.filteredProblems = [];
        this.init();
    }

    init() {
        this.loadProblems();
        this.setupEventListeners();
        this.renderProblems();
        this.updateStats();
    }

    loadProblems() {
        this.allProblems = JSON.parse(localStorage.getItem('leetprep_problems') || '[]');
        this.filteredProblems = [...this.allProblems];
    }

    setupEventListeners() {
        document.getElementById('difficulty-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('language-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sort-filter').addEventListener('change', () => this.applyFilters());
    }

    applyFilters() {
        const difficultyFilter = document.getElementById('difficulty-filter').value;
        const languageFilter = document.getElementById('language-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;

        // Apply filters
        this.filteredProblems = this.allProblems.filter(problem => {
            const matchesDifficulty = !difficultyFilter || problem.difficulty === difficultyFilter;
            const matchesLanguage = !languageFilter || problem.languages.includes(languageFilter);
            
            return matchesDifficulty && matchesLanguage;
        });

        // Apply sorting
        this.filteredProblems.sort((a, b) => {
            switch (sortFilter) {
                case 'date':
                    return new Date(b.publishDate) - new Date(a.publishDate);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'number':
                default:
                    return parseInt(a.number) - parseInt(b.number);
            }
        });

        this.renderProblems();
    }

    renderProblems() {
        const container = document.getElementById('problems-table-body');
        const emptyState = document.getElementById('empty-state');

        if (this.filteredProblems.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            document.querySelector('.problems-table').style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        document.querySelector('.problems-table').style.display = 'block';

        container.innerHTML = this.filteredProblems.map(problem => `
            <div class="table-row" onclick="openProblem(${problem.number})">
                <div class="problem-number">#${problem.number}</div>
                <div class="problem-title">${this.escapeHtml(problem.title)}</div>
                <div>
                    <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
                </div>
                <div class="problem-date desktop-only">
                    ${new Date(problem.publishDate).toLocaleDateString()}
                </div>
                <div class="problem-languages desktop-only">
                    ${problem.languages.map(lang => 
                        `<span class="language-tag">${lang}</span>`
                    ).join('')}
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const total = this.allProblems.length;
        const easy = this.allProblems.filter(p => p.difficulty === 'easy').length;
        const medium = this.allProblems.filter(p => p.difficulty === 'medium').length;
        const hard = this.allProblems.filter(p => p.difficulty === 'hard').length;

        document.getElementById('total-problems').textContent = total;
        document.getElementById('easy-count').textContent = easy;
        document.getElementById('medium-count').textContent = medium;
        document.getElementById('hard-count').textContent = hard;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global function to open problem
function openProblem(problemNumber) {
    window.open(`problem.html?id=${problemNumber}`, '_blank');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    new AllProblemsManager();
});
