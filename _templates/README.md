# LeetPrep Problem Template

This template provides everything you need to add a new problem to your LeetPrep website.

## Quick Start Guide

### 1. Copy the Template
```bash
cp -r _templates/problem-template problems/your-problem-slug
```

### 2. Edit config.json
- Update the `id` to the next available number
- Change `title`, `slug`, and `description`
- Set the correct `difficulty` (Easy/Medium/Hard)
- Add appropriate `tags`
- Update `publishDate` to today's date
- Replace example URLs with real ones
- Fill in the problem content and solutions

### 3. Add to Problems Manager
In `js/problems-manager.js`, add your problem slug to the `discoverProblems()` array:
```javascript
return [
    'your-problem-slug'  // Add this line
];
```

### 4. Test Your Problem
- Refresh the website
- Check that your problem appears in the all-problems page
- Test the individual problem page (if created)

## Template Structure

```
problem-template/
├── config.json          # Problem metadata and content
├── index.html           # Individual problem page (optional)
├── problem.js           # Problem page JavaScript
├── problem.css          # Problem page styles
└── images/              # Problem images and diagrams
```

## Config.json Fields Explained

- **id**: Unique problem number (1, 2, 3, ...)
- **title**: Problem title as shown on LeetCode
- **slug**: URL-friendly version (lowercase, hyphens)
- **difficulty**: Must be "Easy", "Medium", or "Hard"
- **tags**: Array of algorithm/data structure tags
- **publishDate**: YYYY-MM-DD format
- **videoUrl**: Your YouTube solution video
- **leetcodeUrl**: Link to the LeetCode problem
- **languages**: Programming languages you provide solutions for
- **description**: Brief description for the problems list
- **approach**: Main solution approach with complexity
- **content**: Full problem statement, examples, constraints, insights
- **solutions**: Code solutions in different languages

## Styling Tips

- Use `<code>` tags for inline code formatting
- Use `<strong>` tags for emphasis
- Use `<sup>` for superscripts in complexity notation
- HTML is supported in all text fields

## Example Problem Slug

For "Two Sum" problem:
- Title: "Two Sum"
- Slug: "two-sum"
- Directory: `problems/two-sum/`

Happy coding! 🚀
