// Admin Panel JavaScript for LeetPrep with Password Protection
class AdminPanel {
    constructor() {
        // Store the hashed password (SHA-256 hash of "leetprep@Ujar+2003")
        this.passwordHash = '12ef3c04924613ea80ee795ac47c2464dc48f3ff705669bbef85daa11bbab1ca';
        this.isAuthenticated = false;
        this.currentProblem = null;
        this.contentElements = [];
        this.init();
    }

    init() {
        this.setupAuthentication();
        this.setupEventListeners();
    }

    async setupAuthentication() {
        // Check if already authenticated in this session
        const sessionAuth = sessionStorage.getItem('leetprep_admin_auth');
        if (sessionAuth === 'authenticated') {
            this.authenticateUser();
            return;
        }

        // Show login overlay
        this.showLoginOverlay();
    }

    showLoginOverlay() {
        const overlay = document.getElementById('login-overlay');
        const form = document.getElementById('login-form');
        const passwordInput = document.getElementById('admin-password');
        const errorDiv = document.getElementById('login-error');
        
        overlay.style.display = 'flex';
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const password = passwordInput.value;
            const isValid = await this.validatePassword(password);
            
            if (isValid) {
                this.authenticateUser();
                sessionStorage.setItem('leetprep_admin_auth', 'authenticated');
                overlay.style.display = 'none';
                errorDiv.style.display = 'none';
                passwordInput.value = '';
            } else {
                errorDiv.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
                
                // Add shake animation
                form.style.animation = 'shake 0.5s';
                setTimeout(() => form.style.animation = '', 500);
            }
        });

        // Focus password input
        passwordInput.focus();
    }

    async validatePassword(password) {
        // Hash the input password using SHA-256
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex === this.passwordHash;
    }

    authenticateUser() {
        this.isAuthenticated = true;
        const adminContent = document.getElementById('admin-content');
        adminContent.classList.add('authenticated');
        
        // Set up logout functionality
        const logoutButton = document.getElementById('logout-button');
        logoutButton.addEventListener('click', () => this.logout());
        
        // Initialize admin panel
        this.loadProblems();
        this.setupEventListeners();
        
        // Set today's date as default
        const publishDateInput = document.getElementById('publish-date');
        if (publishDateInput) {
            publishDateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    logout() {
        sessionStorage.removeItem('leetprep_admin_auth');
        this.isAuthenticated = false;
        
        const adminContent = document.getElementById('admin-content');
        adminContent.classList.remove('authenticated');
        
        this.showLoginOverlay();
    }

    setupEventListeners() {
        // Only set up event listeners if authenticated
        if (!this.isAuthenticated) return;
        
        // Tab navigation
        document.querySelectorAll('.tab-navigation button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.onclick.toString().match(/showTab\('(.+?)'\)/)[1];
                this.showTab(tabId);
            });
        });
    }

    showTab(tabId) {
        // Hide all tabs
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.style.display = 'none';
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-navigation button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(tabId).style.display = 'block';
        
        // Add active class to clicked button
        event.target.classList.add('active');
        
        // Load content based on tab
        if (tabId === 'manage-problems') {
            this.loadProblems();
        }
    }

    addContentElement(type) {
        const container = document.getElementById('content-elements');
        const elementId = 'element_' + Date.now();
        
        let elementHTML = '';
        
        switch(type) {
            case 'text':
                elementHTML = `
                    <div class="content-element" data-type="text" data-id="${elementId}">
                        <div class="element-controls">
                            <button class="btn-small btn-move" onclick="moveElement('${elementId}', 'up')">↑</button>
                            <button class="btn-small btn-move" onclick="moveElement('${elementId}', 'down')">↓</button>
                            <button class="btn-small btn-danger" onclick="removeElement('${elementId}')">×</button>
                        </div>
                        <h4>Text Content</h4>
                        <div class="form-group">
                            <label>Content Type</label>
                            <select onchange="updateTextType('${elementId}', this.value)">
                                <option value="paragraph">Paragraph</option>
                                <option value="heading">Heading</option>
                                <option value="list">List</option>
                                <option value="blockquote">Quote/Note</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Content</label>
                            <textarea placeholder="Enter your content here..." rows="4"></textarea>
                        </div>
                    </div>
                `;
                break;
                
            case 'code':
                elementHTML = `
                    <div class="content-element" data-type="code" data-id="${elementId}">
                        <div class="element-controls">
                            <button class="btn-small btn-move" onclick="moveElement('${elementId}', 'up')">↑</button>
                            <button class="btn-small btn-move" onclick="moveElement('${elementId}', 'down')">↓</button>
                            <button class="btn-small btn-danger" onclick="removeElement('${elementId}')">×</button>
                        </div>
                        <h4>Code Block</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label>Programming Language</label>
                                <select>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="sql">SQL</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Title (optional)</label>
                                <input type="text" placeholder="Solution Title">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Code</label>
                            <textarea placeholder="Paste your code here..." rows="8" style="font-family: 'JetBrains Mono', monospace;"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Explanation (optional)</label>
                            <textarea placeholder="Explain the code..." rows="3"></textarea>
                        </div>
                    </div>
                `;
                break;
                
            case 'image':
                elementHTML = `
                    <div class="content-element" data-type="image" data-id="${elementId}">
                        <div class="element-controls">
                            <button class="btn-small btn-move" onclick="moveElement('${elementId}', 'up')">↑</button>
                            <button class="btn-small btn-move" onclick="moveElement('${elementId}', 'down')">↓</button>
                            <button class="btn-small btn-danger" onclick="removeElement('${elementId}')">×</button>
                        </div>
                        <h4>Image</h4>
                        <div class="form-group">
                            <label>Image URL</label>
                            <input type="url" placeholder="https://example.com/image.jpg">
                        </div>
                        <div class="form-group">
                            <label>Alt Text</label>
                            <input type="text" placeholder="Describe the image">
                        </div>
                        <div class="form-group">
                            <label>Caption (optional)</label>
                            <input type="text" placeholder="Image caption">
                        </div>
                        <div class="form-group">
                            <label>Size</label>
                            <select>
                                <option value="small">Small (300px)</option>
                                <option value="medium">Medium (600px)</option>
                                <option value="large">Large (100%)</option>
                            </select>
                        </div>
                    </div>
                `;
                break;
                
            case 'ad':
                elementHTML = `
                    <div class="content-element" data-type="ad" data-id="${elementId}">
                        <div class="element-controls">
                            <button class="btn-small btn-move" onclick="moveElement('${elementId}', 'up')">↑</button>
                            <button class="btn-small btn-move" onclick="moveElement('${elementId}', 'down')">↓</button>
                            <button class="btn-small btn-danger" onclick="removeElement('${elementId}')">×</button>
                        </div>
                        <h4>Advertisement</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label>Ad Type</label>
                                <select>
                                    <option value="banner">Banner Ad</option>
                                    <option value="square">Square Ad</option>
                                    <option value="responsive">Responsive Ad</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Ad Slot ID (optional)</label>
                                <input type="text" placeholder="1234567890">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Ad Label</label>
                            <input type="text" value="Advertisement" placeholder="Advertisement">
                        </div>
                    </div>
                `;
                break;
                
            case 'complexity':
                elementHTML = `
                    <div class="content-element" data-type="complexity" data-id="${elementId}">
                        <div class="element-controls">
                            <button class="btn-small btn-move" onclick="moveElement('${elementId}', 'up')">↑</button>
                            <button class="btn-small btn-move" onclick="moveElement('${elementId}', 'down')">↓</button>
                            <button class="btn-small btn-danger" onclick="removeElement('${elementId}')">×</button>
                        </div>
                        <h4>Complexity Analysis</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label>Time Complexity</label>
                                <input type="text" placeholder="O(n)" value="O(n)">
                            </div>
                            <div class="form-group">
                                <label>Space Complexity</label>
                                <input type="text" placeholder="O(1)" value="O(1)">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Time Explanation</label>
                            <textarea placeholder="Explain time complexity..." rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Space Explanation</label>
                            <textarea placeholder="Explain space complexity..." rows="2"></textarea>
                        </div>
                    </div>
                `;
                break;
        }
        
        // Remove placeholder text if it exists
        const placeholder = container.querySelector('p');
        if (placeholder) {
            placeholder.remove();
        }
        
        container.insertAdjacentHTML('beforeend', elementHTML);
    }

    moveElement(elementId, direction) {
        const element = document.querySelector(`[data-id="${elementId}"]`);
        const container = element.parentElement;
        
        if (direction === 'up' && element.previousElementSibling) {
            container.insertBefore(element, element.previousElementSibling);
        } else if (direction === 'down' && element.nextElementSibling) {
            container.insertBefore(element.nextElementSibling, element);
        }
    }

    removeElement(elementId) {
        const element = document.querySelector(`[data-id="${elementId}"]`);
        if (confirm('Are you sure you want to remove this element?')) {
            element.remove();
            
            // Add placeholder if no elements remain
            const container = document.getElementById('content-elements');
            if (container.children.length === 0) {
                container.innerHTML = `
                    <p style="text-align: center; color: var(--text-secondary); margin: 0;">
                        Add content elements above to build your problem page
                    </p>
                `;
            }
        }
    }

    updateTextType(elementId, type) {
        const element = document.querySelector(`[data-id="${elementId}"]`);
        const textarea = element.querySelector('textarea');
        
        // Update placeholder based on type
        const placeholders = {
            paragraph: 'Enter your paragraph content here...',
            heading: 'Enter your heading text here...',
            list: 'Enter list items (one per line):\n- Item 1\n- Item 2\n- Item 3',
            blockquote: 'Enter your note or important information here...'
        };
        
        textarea.placeholder = placeholders[type] || 'Enter your content here...';
    }

    saveProblem() {
        const form = document.getElementById('problem-form');
        const formData = new FormData(form);
        
        // Get form data
        const problemData = {
            number: document.getElementById('problem-number').value,
            title: document.getElementById('problem-title').value,
            difficulty: document.getElementById('problem-difficulty').value,
            publishDate: document.getElementById('publish-date').value,
            description: document.getElementById('problem-description').value,
            youtubeUrl: document.getElementById('youtube-url').value,
            languages: document.getElementById('languages').value.split(',').map(lang => lang.trim()),
            content: this.collectContentElements(),
            slug: this.generateSlug(document.getElementById('problem-title').value),
            id: 'problem_' + document.getElementById('problem-number').value
        };
        
        // Validate required fields
        if (!problemData.number || !problemData.title || !problemData.difficulty || !problemData.publishDate) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Save to localStorage (in a real app, this would be sent to a server)
        this.saveProblemToStorage(problemData);
        
        alert('Problem saved successfully!');
        this.clearForm();
        this.loadProblems();
    }

    collectContentElements() {
        const elements = document.querySelectorAll('#content-elements .content-element');
        const content = [];
        
        elements.forEach(element => {
            const type = element.dataset.type;
            const elementData = { type, id: element.dataset.id };
            
            // Collect data based on element type
            switch(type) {
                case 'text':
                    elementData.contentType = element.querySelector('select').value;
                    elementData.content = element.querySelector('textarea').value;
                    break;
                    
                case 'code':
                    elementData.language = element.querySelector('select').value;
                    elementData.title = element.querySelector('input[placeholder="Solution Title"]').value;
                    elementData.code = element.querySelector('textarea[placeholder="Paste your code here..."]').value;
                    elementData.explanation = element.querySelector('textarea[placeholder="Explain the code..."]').value;
                    break;
                    
                case 'image':
                    elementData.url = element.querySelector('input[placeholder*="image.jpg"]').value;
                    elementData.alt = element.querySelector('input[placeholder="Describe the image"]').value;
                    elementData.caption = element.querySelector('input[placeholder="Image caption"]').value;
                    elementData.size = element.querySelector('select').value;
                    break;
                    
                case 'ad':
                    elementData.adType = element.querySelector('select').value;
                    elementData.slotId = element.querySelector('input[placeholder="1234567890"]').value;
                    elementData.label = element.querySelector('input[value="Advertisement"]').value;
                    break;
                    
                case 'complexity':
                    elementData.timeComplexity = element.querySelector('input[placeholder="O(n)"]').value;
                    elementData.spaceComplexity = element.querySelector('input[placeholder="O(1)"]').value;
                    elementData.timeExplanation = element.querySelector('textarea[placeholder="Explain time complexity..."]').value;
                    elementData.spaceExplanation = element.querySelector('textarea[placeholder="Explain space complexity..."]').value;
                    break;
            }
            
            content.push(elementData);
        });
        
        return content;
    }

    generateSlug(title) {
        return title.toLowerCase()
                   .replace(/[^a-z0-9]+/g, '-')
                   .replace(/^-+|-+$/g, '');
    }

    saveProblemToStorage(problemData) {
        let problems = JSON.parse(localStorage.getItem('leetprep_problems') || '[]');
        
        // Check if problem already exists
        const existingIndex = problems.findIndex(p => p.number == problemData.number);
        
        if (existingIndex !== -1) {
            problems[existingIndex] = problemData;
        } else {
            problems.push(problemData);
        }
        
        // Sort by problem number
        problems.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        
        localStorage.setItem('leetprep_problems', JSON.stringify(problems));
        
        // Also save individual problem file
        localStorage.setItem(`leetprep_problem_${problemData.number}`, JSON.stringify(problemData));
    }

    loadProblems() {
        const problems = JSON.parse(localStorage.getItem('leetprep_problems') || '[]');
        const container = document.getElementById('problems-list');
        
        if (problems.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <h3>No problems found</h3>
                    <p>Create your first problem using the "Create Problem" tab.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = problems.map(problem => `
            <div class="problem-item">
                <div class="problem-info">
                    <h4>#${problem.number}: ${problem.title}</h4>
                    <p>
                        <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span> • 
                        Published: ${new Date(problem.publishDate).toLocaleDateString()} • 
                        ${problem.languages.join(', ')}
                    </p>
                </div>
                <div class="problem-actions">
                    <button class="btn-small btn-secondary" onclick="admin.editProblem(${problem.number})">Edit</button>
                    <button class="btn-small btn-outline" onclick="admin.viewProblem(${problem.number})">View</button>
                    <button class="btn-small btn-danger" onclick="admin.deleteProblem(${problem.number})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    editProblem(problemNumber) {
        const problem = JSON.parse(localStorage.getItem(`leetprep_problem_${problemNumber}`));
        if (!problem) return;
        
        // Switch to create problem tab
        this.showTab('create-problem');
        
        // Fill form with existing data
        document.getElementById('problem-number').value = problem.number;
        document.getElementById('problem-title').value = problem.title;
        document.getElementById('problem-difficulty').value = problem.difficulty;
        document.getElementById('publish-date').value = problem.publishDate;
        document.getElementById('problem-description').value = problem.description;
        document.getElementById('youtube-url').value = problem.youtubeUrl || '';
        document.getElementById('languages').value = problem.languages.join(', ');
        
        // Clear existing content elements
        document.getElementById('content-elements').innerHTML = '';
        
        // Recreate content elements
        if (problem.content && problem.content.length > 0) {
            problem.content.forEach(element => {
                this.recreateContentElement(element);
            });
        } else {
            document.getElementById('content-elements').innerHTML = `
                <p style="text-align: center; color: var(--text-secondary); margin: 0;">
                    Add content elements above to build your problem page
                </p>
            `;
        }
    }

    recreateContentElement(elementData) {
        // This would recreate the content element with the stored data
        // Implementation depends on the specific element type
        this.addContentElement(elementData.type);
        
        // Fill in the data (simplified version)
        const element = document.querySelector(`[data-id="${elementData.id}"]`) || 
                       document.querySelector('#content-elements .content-element:last-child');
        
        if (element) {
            element.dataset.id = elementData.id;
            // Fill in specific data based on type...
        }
    }

    viewProblem(problemNumber) {
        window.open(`problem.html?id=${problemNumber}`, '_blank');
    }

    deleteProblem(problemNumber) {
        if (confirm(`Are you sure you want to delete problem #${problemNumber}?`)) {
            let problems = JSON.parse(localStorage.getItem('leetprep_problems') || '[]');
            problems = problems.filter(p => p.number != problemNumber);
            
            localStorage.setItem('leetprep_problems', JSON.stringify(problems));
            localStorage.removeItem(`leetprep_problem_${problemNumber}`);
            
            this.loadProblems();
        }
    }

    previewProblem() {
        const problemData = {
            number: document.getElementById('problem-number').value,
            title: document.getElementById('problem-title').value,
            difficulty: document.getElementById('problem-difficulty').value,
            content: this.collectContentElements()
        };
        
        // Store temporary preview data
        sessionStorage.setItem('leetprep_preview', JSON.stringify(problemData));
        
        // Open preview window
        window.open('problem.html?preview=true', '_blank');
    }

    clearForm() {
        document.getElementById('problem-form').reset();
        document.getElementById('content-elements').innerHTML = `
            <p style="text-align: center; color: var(--text-secondary); margin: 0;">
                Add content elements above to build your problem page
            </p>
        `;
        document.getElementById('publish-date').value = new Date().toISOString().split('T')[0];
    }

    saveSettings() {
        const settings = {
            siteTitle: document.getElementById('site-title').value,
            siteDescription: document.getElementById('site-description').value,
            youtubeChannel: document.getElementById('youtube-channel').value,
            githubUrl: document.getElementById('github-url').value,
            adsenseClient: document.getElementById('adsense-client').value,
            adFrequency: document.getElementById('ad-frequency').value
        };
        
        localStorage.setItem('leetprep_settings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    }
}

// Global functions for onclick handlers
let admin;

function showTab(tabId) {
    admin.showTab(tabId);
}

function addContentElement(type) {
    admin.addContentElement(type);
}

function moveElement(elementId, direction) {
    admin.moveElement(elementId, direction);
}

function removeElement(elementId) {
    admin.removeElement(elementId);
}

function updateTextType(elementId, type) {
    admin.updateTextType(elementId, type);
}

function saveProblem() {
    admin.saveProblem();
}

function previewProblem() {
    admin.previewProblem();
}

function saveSettings() {
    admin.saveSettings();
}

// Initialize admin panel when page loads
document.addEventListener('DOMContentLoaded', function() {
    admin = new AdminPanel();
});
