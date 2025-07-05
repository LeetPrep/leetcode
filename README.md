# LeetPrep - LeetCode Solutions Website

A modern, LeetCode-themed static website for the **LeetPrep** YouTube channel, showcasing LeetCode problem solutions with detailed explanations in Python, Java, and C++. Perfect for coding interview preparation and algorithm learning.

🔗 **Live Demo**: [https://leetprep.me](https://leetprep.me)  
📺 **YouTube Channel**: [https://www.youtube.com/@leet_prep](https://www.youtube.com/@leet_prep)  
💻 **GitHub**: [https://github.com/LeetPrep](https://github.com/LeetPrep)

## 🌟 Features

- **LeetCode Color Palette**: Authentic LeetCode-inspired dark theme
- **LeetPrep Branding**: Custom logo integration and channel branding
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Multi-language Support**: Solutions in Python, Java, and C++
- **Syntax Highlighting**: Custom syntax highlighting for better code readability
- **AdSense Ready**: Pre-configured ad spaces for monetization
- **GitHub Pages Compatible**: Ready to deploy on GitHub Pages
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Dynamic Stats**: Animated counters for problems solved, views, and subscribers

## 🚀 Quick Start

1. **Fork/Clone** the repository from [https://github.com/LeetPrep](https://github.com/LeetPrep)
2. **Customize** the content in `script.js` to add your problems
3. **Update** YouTube links and channel information
4. **Deploy** to GitHub Pages

## 📁 File Structure

```
Website/
├── index.html              # Main homepage
├── all-problems.html       # All problems listing page
├── styles.css             # All CSS styles
├── js/                    # JavaScript functionality
│   ├── problems-manager.js # Problem data management
│   ├── seo-manager.js     # SEO and structured data
│   ├── home-page.js       # Homepage functionality
│   ├── all-problems.js    # Problems page functionality
│   └── search.js          # Search functionality
├── _templates/            # Problem templates
│   ├── problem-template/  # Template for new problems
│   └── README.md          # Template usage guide
├── problems/              # Individual problem folders
├── images/                # Logo and image assets
│   └── README.md          # Image requirements guide
├── robots.txt             # SEO crawling instructions
├── sitemap.xml            # SEO sitemap (dynamic generation available)
├── .htaccess              # Server configuration (Apache)
└── README.md              # This file
```

## 🔧 Quick Customization

### Update Your Stats (Easy!)
In `script.js`, update these numbers:
```javascript
const channelStats = {
    problemsSolved: 0, // Auto-calculated from problems array
    totalViews: 50000, // Update with your actual view count
    subscribers: 2500   // Update with your actual subscriber count
};
```

### Add Your Logo
Place these files in the `images/` folder:
- `logo.png` - Your LeetPrep logo (120x40px recommended)
- `favicon.ico` - Browser tab icon

### Update Links
All links are already configured for:
- **YouTube**: https://www.youtube.com/@leet_prep
- **GitHub**: https://github.com/LeetPrep

## 🌐 Deployment to GitHub Pages

1. **Create Repository**: Create a new GitHub repository (or use existing LeetPrep repo)
2. **Upload Files**: Upload all website files to the repository
3. **Enable Pages**: Go to Settings → Pages → Source → Deploy from branch
4. **Select Branch**: Choose `main` branch and root folder
5. **Access Website**: Your site will be available at `https://leetprep.me`

## 📝 Adding New Problems

Edit the `problems` array in `script.js`:

```javascript
{
    id: 6,
    number: 20,
    title: "Valid Parentheses",
    difficulty: "easy",
    description: "Given a string containing parentheses, determine if it's valid...",
    languages: ["Python", "Java", "C++"],
    videoUrl: "https://www.youtube.com/@leet_prep/videos",
    // ... rest of problem data
}
```

## 🎨 LeetCode Color Palette

The website uses authentic LeetCode colors:
- **Primary Background**: `#1a1a1a`
- **Secondary Background**: `#262626`
- **Accent Color**: `#ffa116` (LeetCode orange)
- **Easy Problems**: `#00b8a3`
- **Medium Problems**: `#ffc01e`
- **Hard Problems**: `#ef4743`

## 📱 Features Highlights

### Sequential Problem Solving
- Problems displayed in LeetCode order (starting from #1)
- "📚 In Order" badges for early problems
- Emphasis on systematic learning approach

### Dynamic Statistics
- **Animated counters** on page load
- **Auto-calculated** problems solved
- **Easy updates** for views and subscribers

### Professional Design
- **LeetCode-authentic** styling
- **Mobile-responsive** design
- **AdSense integration** ready
- **SEO optimized** for search engines

## 🔍 SEO Features

- **Canonical URLs** for all pages to prevent duplicate content
- **Dynamic sitemap generation** with JavaScript
- **Structured data** (JSON-LD) for rich snippets
- **Open Graph** and Twitter Card meta tags
- **Breadcrumb navigation** for better user experience
- **Optimized robots.txt** with proper directives
- **Performance optimizations** (lazy loading, compression)
- **Mobile-first responsive design**
- **Semantic HTML** structure
- **Fast loading** with optimized assets

### SEO Manager Features:
- **Automatic structured data** injection
- **Dynamic meta tag** updates
- **Sitemap generation** based on available problems
- **Image optimization** with lazy loading
- **Preload hints** for critical resources

## 📞 Support

For questions or customization help:
- **GitHub Issues**: [https://github.com/LeetPrep/issues](https://github.com/LeetPrep/issues)
- **YouTube Channel**: [https://www.youtube.com/@leet_prep](https://www.youtube.com/@leet_prep)

---

**Happy Coding!** 🚀  
Master LeetCode problems the smart way with LeetPrep!
