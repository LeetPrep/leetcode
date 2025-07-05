// Problem Loader - Dynamically loads and renders problems
class ProblemLoader {
    constructor() {
        this.currentProblem = null;
        this.allProblems = [];
        this.settings = {};
        this.init();
    }

    init() {
        this.loadSettings();
        this.loadProblem();
    }

    loadSettings() {
        this.settings = JSON.parse(localStorage.getItem('leetprep_settings') || '{}');
        
        // Apply AdSense settings if available
        if (this.settings.adsenseClient) {
            this.setupAdSense();
        }
    }

    setupAdSense() {
        const script = document.getElementById('adsense-script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.settings.adsenseClient}`;
        script.crossOrigin = 'anonymous';
        script.async = true;
    }

    async loadProblem() {
        const urlParams = new URLSearchParams(window.location.search);
        const problemId = urlParams.get('id');
        const isPreview = urlParams.get('preview') === 'true';

        try {
            let problemData;

            if (isPreview) {
                // Load preview data from sessionStorage
                problemData = JSON.parse(sessionStorage.getItem('leetprep_preview') || 'null');
                if (!problemData) {
                    throw new Error('Preview data not found');
                }
            } else if (problemId) {
                // Load specific problem
                problemData = JSON.parse(localStorage.getItem(`leetprep_problem_${problemId}`) || 'null');
                if (!problemData) {
                    throw new Error('Problem not found');
                }
            } else {
                throw new Error('No problem specified');
            }

            this.currentProblem = problemData;
            this.loadAllProblems();
            this.renderProblem(problemData);
            this.setupNavigation();

        } catch (error) {
            console.error('Error loading problem:', error);
            this.showNotFound();
        }
    }

    loadAllProblems() {
        this.allProblems = JSON.parse(localStorage.getItem('leetprep_problems') || '[]');
    }

    renderProblem(problem) {
        // Hide loading, show content
        document.getElementById('loading').style.display = 'none';
        document.getElementById('problem-content').style.display = 'block';

        // Update page metadata
        this.updatePageMetadata(problem);

        // Render problem header
        this.renderProblemHeader(problem);

        // Render dynamic content
        this.renderDynamicContent(problem.content || []);
    }

    updatePageMetadata(problem) {
        document.getElementById('page-title').textContent = `${problem.number}. ${problem.title} - LeetPrep | LeetCode Solution`;
        document.getElementById('page-description').content = `Detailed solution for LeetCode ${problem.title} problem with explanations. ${problem.description}`;
    }

    renderProblemHeader(problem) {
        const header = document.getElementById('problem-header');
        header.innerHTML = `
            <div class="problem-detail-header">
                <div class="problem-detail-title">
                    <h1>${problem.number}. ${problem.title}</h1>
                    <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
                </div>
                <div class="problem-meta">
                    ${problem.youtubeUrl ? `
                        <div class="meta-item">
                            <span>🎥</span>
                            <a href="${problem.youtubeUrl}" target="_blank" rel="noopener">Watch Video Solution</a>
                        </div>
                    ` : ''}
                    <div class="meta-item">
                        <span>💻</span>
                        <span>Languages: ${problem.languages.join(', ')}</span>
                    </div>
                    <div class="meta-item">
                        <span>📅</span>
                        <span>Published: ${new Date(problem.publishDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderDynamicContent(contentElements) {
        const container = document.getElementById('dynamic-content');
        let html = '';

        if (contentElements.length === 0) {
            html = `
                <div class="content-text">
                    <p>This problem doesn't have detailed content yet. Check back later for a complete solution and explanation.</p>
                </div>
            `;
        } else {
            contentElements.forEach((element, index) => {
                html += this.renderContentElement(element, index);
                
                // Add ads based on frequency setting
                const adFrequency = parseInt(this.settings.adFrequency || '3');
                if ((index + 1) % adFrequency === 0 && index < contentElements.length - 1) {
                    html += this.renderAdElement();
                }
            });
        }

        container.innerHTML = html;

        // Initialize any interactive elements
        this.initializeInteractiveElements();
    }

    renderContentElement(element, index) {
        switch (element.type) {
            case 'text':
                return this.renderTextElement(element);
            case 'code':
                return this.renderCodeElement(element);
            case 'image':
                return this.renderImageElement(element);
            case 'ad':
                return this.renderAdElement(element);
            case 'complexity':
                return this.renderComplexityElement(element);
            default:
                return '';
        }
    }

    renderTextElement(element) {
        const content = element.content || '';
        
        switch (element.contentType) {
            case 'heading':
                return `<h2 class="content-heading">${this.escapeHtml(content)}</h2>`;
            
            case 'list':
                const items = content.split('\n').filter(line => line.trim())
                    .map(line => line.replace(/^[-*]\s*/, '').trim())
                    .filter(item => item);
                return `
                    <ul class="content-list">
                        ${items.map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                    </ul>
                `;
            
            case 'blockquote':
                return `<div class="content-blockquote">${this.escapeHtml(content)}</div>`;
            
            default: // paragraph
                return `<div class="content-text"><p>${this.escapeHtml(content)}</p></div>`;
        }
    }

    renderCodeElement(element) {
        const title = element.title ? `<h3>${this.escapeHtml(element.title)}</h3>` : '';
        const explanation = element.explanation ? `<p style="margin-top: 1rem; color: var(--text-secondary);">${this.escapeHtml(element.explanation)}</p>` : '';
        
        return `
            <div class="solution-code" style="margin: 2rem 0;">
                <div class="code-header">
                    ${title}
                    <span class="language-tag">${element.language}</span>
                    <button class="copy-button" onclick="copyCode(this)">Copy</button>
                </div>
                <div class="code-block">
                    <pre><code class="language-${element.language}">${this.escapeHtml(element.code || '')}</code></pre>
                </div>
                ${explanation}
            </div>
        `;
    }

    renderImageElement(element) {
        if (!element.url) return '';
        
        const caption = element.caption ? `<figcaption>${this.escapeHtml(element.caption)}</figcaption>` : '';
        const size = element.size || 'medium';
        
        return `
            <div class="content-image ${size}">
                <figure>
                    <img src="${element.url}" alt="${this.escapeHtml(element.alt || '')}" loading="lazy">
                    ${caption}
                </figure>
            </div>
        `;
    }

    renderAdElement(element = {}) {
        const label = element.label || 'Advertisement';
        const adType = element.adType || 'banner';
        
        // If AdSense is configured, render actual ad
        if (this.settings.adsenseClient && element.slotId) {
            return `
                <div class="dynamic-ad">
                    <div class="ad-label">${this.escapeHtml(label)}</div>
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="${this.settings.adsenseClient}"
                         data-ad-slot="${element.slotId}"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                    <script>
                         (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>
                </div>
            `;
        }
        
        // Otherwise render placeholder
        return `
            <div class="ad-container dynamic-ad">
                <div class="ad-placeholder">
                    <div class="ad-label">${this.escapeHtml(label)}</div>
                </div>
            </div>
        `;
    }

    renderComplexityElement(element) {
        return `
            <div class="complexity-analysis" style="margin: 2rem 0;">
                <h3>Complexity Analysis</h3>
                <div class="complexity-item">
                    <span>Time Complexity:</span>
                    <span>${this.escapeHtml(element.timeComplexity || 'N/A')}</span>
                </div>
                <div class="complexity-item">
                    <span>Space Complexity:</span>
                    <span>${this.escapeHtml(element.spaceComplexity || 'N/A')}</span>
                </div>
                ${element.timeExplanation ? `
                    <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.875rem;">
                        <p><strong>Time:</strong> ${this.escapeHtml(element.timeExplanation)}</p>
                    </div>
                ` : ''}
                ${element.spaceExplanation ? `
                    <div style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">
                        <p><strong>Space:</strong> ${this.escapeHtml(element.spaceExplanation)}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    setupNavigation() {
        if (!this.currentProblem || this.allProblems.length <= 1) return;

        const currentIndex = this.allProblems.findIndex(p => p.number == this.currentProblem.number);
        
        // Previous problem
        if (currentIndex > 0) {
            const prevProblem = this.allProblems[currentIndex - 1];
            const prevBtn = document.getElementById('prev-problem');
            prevBtn.style.display = 'inline-block';
            prevBtn.textContent = `← Problem ${prevProblem.number}`;
            prevBtn.onclick = () => {
                window.location.href = `problem.html?id=${prevProblem.number}`;
            };
        }

        // Next problem
        if (currentIndex < this.allProblems.length - 1) {
            const nextProblem = this.allProblems[currentIndex + 1];
            const nextBtn = document.getElementById('next-problem');
            nextBtn.style.display = 'inline-block';
            nextBtn.textContent = `Problem ${nextProblem.number} →`;
            nextBtn.onclick = () => {
                window.location.href = `problem.html?id=${nextProblem.number}`;
            };
        }
    }

    initializeInteractiveElements() {
        // Add syntax highlighting if available
        if (window.Prism) {
            Prism.highlightAll();
        }

        // Initialize copy buttons
        document.querySelectorAll('.copy-button').forEach(btn => {
            btn.addEventListener('click', function() {
                const codeBlock = this.closest('.solution-code').querySelector('code');
                const text = codeBlock.textContent;
                
                navigator.clipboard.writeText(text).then(() => {
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.textContent = 'Copy';
                    }, 2000);
                });
            });
        });
    }

    showNotFound() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('not-found').style.display = 'block';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global copy function for backward compatibility
function copyCode(button) {
    const codeBlock = button.closest('.solution-code').querySelector('code');
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
    new ProblemLoader();
});
