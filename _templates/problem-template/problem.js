// Problem Page JavaScript
class ProblemPage {
    constructor() {
        this.problemData = null;
        this.currentLanguage = 'python';
        this.init();
    }

    async init() {
        await this.loadProblemData();
        this.renderProblem();
        this.setupEventListeners();
    }

    async loadProblemData() {
        try {
            const response = await fetch('./config.json');
            this.problemData = await response.json();
        } catch (error) {
            console.error('Error loading problem data:', error);
        }
    }

    renderProblem() {
        if (!this.problemData) return;

        // Update page title and meta
        document.title = `${this.problemData.title} - LeetPrep | LeetCode Solutions`;
        document.querySelector('meta[name="description"]').content = 
            `Detailed solution and explanation for ${this.problemData.title} with code in Python, Java, and C++.`;

        // Update problem header
        document.querySelector('.problem-number').textContent = `#${this.problemData.id}`;
        document.querySelector('.problem-title').textContent = this.problemData.title;
        document.querySelector('.problem-difficulty').textContent = this.problemData.difficulty;
        document.querySelector('.problem-difficulty').className = `problem-difficulty ${this.problemData.difficulty.toLowerCase()}`;

        // Update links
        const links = document.querySelectorAll('.problem-links a');
        if (links[0]) links[0].href = this.problemData.leetcodeUrl;
        if (links[1]) links[1].href = this.problemData.videoUrl;

        // Render content sections
        this.renderProblemStatement();
        this.renderExamples();
        this.renderConstraints();
        this.renderApproach();
        this.renderInsights();
        this.renderSolutions();
    }

    renderProblemStatement() {
        const container = document.getElementById('problem-statement');
        if (container && this.problemData.content.problemStatement) {
            container.innerHTML = this.problemData.content.problemStatement;
        }
    }

    renderExamples() {
        const container = document.getElementById('problem-examples');
        if (!container || !this.problemData.content.examples) return;

        container.innerHTML = this.problemData.content.examples.map(example => `
            <div class="example-card">
                <h4>${example.title}</h4>
                <div class="example-content">
                    <div class="example-input"><strong>Input:</strong> ${example.input}</div>
                    <div class="example-output"><strong>Output:</strong> ${example.output}</div>
                    ${example.explanation ? `<div class="example-explanation"><strong>Explanation:</strong> ${example.explanation}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    renderConstraints() {
        const container = document.getElementById('problem-constraints');
        if (!container || !this.problemData.content.constraints) return;

        container.innerHTML = `
            <ul class="constraints-list">
                ${this.problemData.content.constraints.map(constraint => `<li>${constraint}</li>`).join('')}
            </ul>
        `;
    }

    renderApproach() {
        const container = document.getElementById('problem-approach');
        if (!container || !this.problemData.approach) return;

        container.innerHTML = `
            <div class="approach-card">
                <h3>${this.problemData.approach.title}</h3>
                <p>${this.problemData.approach.description}</p>
                <div class="complexity-info">
                    <div class="complexity-item">
                        <strong>Time Complexity:</strong> ${this.problemData.approach.timeComplexity}
                    </div>
                    <div class="complexity-item">
                        <strong>Space Complexity:</strong> ${this.problemData.approach.spaceComplexity}
                    </div>
                </div>
            </div>
        `;
    }

    renderInsights() {
        const container = document.getElementById('problem-insights');
        if (!container || !this.problemData.content.keyInsights) return;

        container.innerHTML = `
            <ul class="insights-list">
                ${this.problemData.content.keyInsights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        `;
    }

    renderSolutions() {
        const container = document.getElementById('solutions-container');
        if (!container || !this.problemData.solutions) return;

        // Render solution for current language
        this.renderSolutionForLanguage(this.currentLanguage);
    }

    renderSolutionForLanguage(language) {
        const container = document.getElementById('solutions-container');
        const solution = this.problemData.solutions[language];
        
        if (!solution) return;

        container.innerHTML = `
            <div class="solution-content">
                <div class="code-block">
                    <div class="code-header">
                        <span class="language-label">${language.charAt(0).toUpperCase() + language.slice(1)}</span>
                        <button class="copy-button" onclick="copyCode(this)">Copy</button>
                    </div>
                    <pre><code class="language-${language === 'cpp' ? 'cpp' : language}">${this.escapeHtml(solution.code)}</code></pre>
                </div>
                <div class="solution-explanation">
                    <h4>Explanation</h4>
                    <p>${solution.explanation}</p>
                </div>
            </div>
        `;

        // Re-highlight syntax
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const language = e.target.getAttribute('data-lang');
                this.switchLanguage(language);
            });
        });
    }

    switchLanguage(language) {
        // Update active tab
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-lang="${language}"]`).classList.add('active');
        
        // Update current language and render
        this.currentLanguage = language;
        this.renderSolutionForLanguage(language);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Copy code functionality
function copyCode(button) {
    const codeBlock = button.closest('.code-block').querySelector('code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    new ProblemPage();
});
