// Home Page Handler
class HomePage {
    constructor() {
        this.init();
    }

    init() {
        // Wait for problems to be loaded
        if (window.problemsManager.problemsLoaded) {
            this.renderHomePage();
        } else {
            document.addEventListener('problemsLoaded', () => {
                this.renderHomePage();
            });
        }
    }

    renderHomePage() {
        this.renderRecentProblems();
        this.renderStats();
    }

    renderRecentProblems() {
        const recentProblems = window.problemsManager.getRecentProblems(3);
        const container = document.getElementById('recent-problems-container');
        
        if (!container) return;

        if (recentProblems.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No problems available yet</h3>
                    <p>Check back soon for new coding problems!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentProblems.map(problem => 
            window.problemsManager.generateProblemCard(problem)
        ).join('');
    }

    renderStats() {
        const stats = window.problemsManager.getProblemStats();
        const statsContainer = document.getElementById('stats-container');
        
        if (!statsContainer) return;

        // Update the first stat (Problems Solved) with total count
        const statNumbers = statsContainer.querySelectorAll('.stat-number');
        if (statNumbers.length > 0) {
            statNumbers[0].textContent = stats.total;
        }

        // You can update other stats here as needed
        // For now, keeping the static values for languages, views, and subscribers
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize home page
    new HomePage();
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active nav link on scroll
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
});
