// Dynamic Sitemap Generator
class SitemapGenerator {
    constructor() {
        this.baseUrl = 'https://leetprep.me';
        this.sitemap = [];
        this.init();
    }

    async init() {
        await this.generateSitemap();
    }

    async generateSitemap() {
        // Wait for problems to be loaded
        if (!window.problemsManager.problemsLoaded) {
            document.addEventListener('problemsLoaded', () => {
                this.generateSitemapEntries();
            });
        } else {
            this.generateSitemapEntries();
        }
    }

    generateSitemapEntries() {
        const problems = window.problemsManager.getAllProblems();
        
        // Clear existing sitemap
        this.sitemap = [];

        // Add main pages
        this.addUrl('/', '1.0', 'daily');
        this.addUrl('/all-problems.html', '0.9', 'weekly');

        // Add problem pages
        problems.forEach(problem => {
            this.addUrl(`/problems/${problem.slug}/`, '0.8', 'monthly');
        });

        // Generate XML and update if needed
        this.generateXML();
    }

    addUrl(url, priority = '0.5', changefreq = 'monthly') {
        this.sitemap.push({
            url: this.baseUrl + url,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: changefreq,
            priority: priority
        });
    }

    generateXML() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        this.sitemap.forEach(entry => {
            xml += '  <url>\n';
            xml += `    <loc>${entry.url}</loc>\n`;
            xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
            xml += `    <priority>${entry.priority}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        // Store in localStorage for potential use
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('dynamicSitemap', xml);
        }

        return xml;
    }

    // Method to get sitemap data for server-side generation
    getSitemapData() {
        return this.sitemap;
    }

    // Method to download sitemap (for development)
    downloadSitemap() {
        const xml = this.generateXML();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// JSON-LD Structured Data Generator
class StructuredDataGenerator {
    constructor() {
        this.baseUrl = 'https://leetprep.me';
    }

    generateWebsiteSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "LeetPrep",
            "alternateName": "LeetPrep - LeetCode Solutions",
            "url": this.baseUrl,
            "description": "Master LeetCode and crack coding interviews with detailed explanations and solutions in Python, Java, and C++.",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": this.baseUrl + "/?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            },
            "publisher": {
                "@type": "Organization",
                "name": "LeetPrep",
                "url": this.baseUrl,
                "logo": {
                    "@type": "ImageObject",
                    "url": this.baseUrl + "/images/logo.png"
                },
                "sameAs": [
                    "https://www.youtube.com/@leet_prep",
                    "https://github.com/LeetPrep"
                ]
            }
        };
    }

    generateOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "LeetPrep",
            "url": this.baseUrl,
            "logo": this.baseUrl + "/images/logo.png",
            "description": "Educational platform for mastering LeetCode problems and coding interviews",
            "sameAs": [
                "https://www.youtube.com/@leet_prep",
                "https://github.com/LeetPrep"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://www.youtube.com/@leet_prep"
            }
        };
    }

    generateBreadcrumbSchema(items) {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        };
    }

    generateProblemSchema(problem) {
        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": problem.title,
            "description": problem.description,
            "url": `${this.baseUrl}/problems/${problem.slug}/`,
            "datePublished": problem.publishDate,
            "dateModified": problem.publishDate,
            "author": {
                "@type": "Organization",
                "name": "LeetPrep"
            },
            "publisher": {
                "@type": "Organization",
                "name": "LeetPrep",
                "logo": {
                    "@type": "ImageObject",
                    "url": this.baseUrl + "/images/logo.png"
                }
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${this.baseUrl}/problems/${problem.slug}/`
            },
            "keywords": problem.tags.join(", "),
            "articleSection": "Programming Tutorial",
            "inLanguage": "en-US"
        };
    }

    injectSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }
}

// SEO Manager
class SEOManager {
    constructor() {
        this.sitemapGenerator = new SitemapGenerator();
        this.structuredData = new StructuredDataGenerator();
        this.init();
    }

    init() {
        this.addStructuredData();
        this.optimizeImages();
        this.addPreloadHints();
    }

    addStructuredData() {
        // Add website schema
        this.structuredData.injectSchema(this.structuredData.generateWebsiteSchema());
        
        // Add organization schema
        this.structuredData.injectSchema(this.structuredData.generateOrganizationSchema());

        // Add breadcrumb if not on homepage
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            const breadcrumbItems = [
                { name: "Home", url: this.structuredData.baseUrl + "/" },
                { name: "Problems", url: this.structuredData.baseUrl + "/all-problems.html" }
            ];
            this.structuredData.injectSchema(this.structuredData.generateBreadcrumbSchema(breadcrumbItems));
        }
    }

    optimizeImages() {
        // Add loading="lazy" to images that are not above the fold
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (index > 2) { // Skip first few images (likely above fold)
                img.loading = 'lazy';
            }
            // Add alt text if missing
            if (!img.alt) {
                img.alt = img.src.split('/').pop().split('.')[0].replace(/-/g, ' ');
            }
        });
    }

    addPreloadHints() {
        // Preload critical resources
        const link1 = document.createElement('link');
        link1.rel = 'preload';
        link1.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
        link1.as = 'style';
        document.head.appendChild(link1);

        // DNS prefetch for external domains
        const link2 = document.createElement('link');
        link2.rel = 'dns-prefetch';
        link2.href = '//www.youtube.com';
        document.head.appendChild(link2);

        const link3 = document.createElement('link');
        link3.rel = 'dns-prefetch';
        link3.href = '//github.com';
        document.head.appendChild(link3);
    }

    updatePageMeta(title, description, canonicalUrl) {
        // Update title
        document.title = title;
        
        // Update description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = description;
        }
        
        // Update canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;

        // Update Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        
        if (ogTitle) ogTitle.content = title;
        if (ogDescription) ogDescription.content = description;
        if (ogUrl) ogUrl.content = canonicalUrl;
    }
}

// Initialize SEO Manager
if (typeof window !== 'undefined') {
    window.seoManager = new SEOManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SitemapGenerator, StructuredDataGenerator, SEOManager };
}
