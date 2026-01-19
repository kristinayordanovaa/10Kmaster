# Markdown Guide for Blog Posts

This guide explains how to write blog posts using Markdown syntax for the 10K to Mastery blog.

## What is Markdown?

Markdown is a lightweight markup language that lets you format text using plain text syntax. It's easy to read and write, and it converts to HTML for display on the web.

## How to Create a New Blog Post

### 1. Prepare Your Header Image

**Recommended Image Specifications:**
- **Resolution:** 1200 x 630 pixels (ideal) or 1600 x 900 pixels (higher quality)
- **Aspect Ratio:** 16:9 works best
- **Format:** JPG or PNG
- **File Size:** Keep under 200KB for fast loading
- **Upload Location:** Save to `/img/blog/your-image-name.jpg`

### 2. Create Your Markdown File

1. Create a new `.md` file in the `/blog` folder
2. Use a URL-friendly filename (e.g., `my-awesome-post.md`)
3. Write your content using Markdown syntax (explained below)

### 3. Register Your Post

Add the post to the `blogPosts` array in `blog-loader.js`:

```javascript
{
    slug: 'my-awesome-post',
    title: 'My Awesome Post',
    excerpt: 'A brief description of what this post is about...',
    image: 'img/blog/your-image-name.jpg'  // ← Add your image path here
}
```

**Important:** The `slug` must match your `.md` filename (without the extension)

The header image will automatically display:
- At the top of the blog post (400px height)
- As a thumbnail on the blog listing page (200px height)

## Markdown Syntax Guide

### Headings

Use `#` symbols to create headings. The number of `#` determines the heading level:

```markdown
# Heading 1 (Main Title - use only once at the top)
## Heading 2 (Major sections)
### Heading 3 (Subsections)
#### Heading 4 (Sub-subsections)
```

**Important:** Always start your blog post with a single `# Heading 1` - this will be extracted as the page title.

### Paragraphs

Simply write text with blank lines between paragraphs:

```markdown
This is the first paragraph.

This is the second paragraph.
```

### Text Formatting

- **Bold text**: Wrap text in `**double asterisks**`
- *Italic text*: Wrap text in `*single asterisks*` or `_underscores_`
- ***Bold and italic***: Use `***triple asterisks***`
- `Inline code`: Wrap in `backticks`
- ~~Strikethrough~~: Wrap in `~~double tildes~~`

### Lists

**Unordered lists** (bullets):
```markdown
- First item
- Second item
- Third item
  - Nested item (indent with 2 spaces)
  - Another nested item
```

**Ordered lists** (numbered):
```markdown
1. First step
2. Second step
3. Third step
   1. Sub-step (indent with 3 spaces)
   2. Another sub-step
```

### Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Hover text")
```

### Images

```markdown
![Alt text](image-url.jpg)
![Alt text with title](image-url.jpg "Image title")
```

### Blockquotes

Use `>` for quotes:

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> And multiple paragraphs.
```

Result:
> This is a blockquote.
> It can span multiple lines.

### Code Blocks

For multi-line code, use triple backticks with optional language:

````markdown
```javascript
function example() {
    console.log("Hello, world!");
}
```
````

### Horizontal Rules

Create a horizontal line with three or more hyphens, asterisks, or underscores:

```markdown
---
```

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

Result:

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Best Practices for Blog Posts

### Structure Your Content

1. **Start with a compelling title** (`# Heading`)
2. **Open with an engaging introduction** (2-3 paragraphs)
3. **Use clear section headings** (`## Heading 2`)
4. **Break up long sections** with subsections (`### Heading 3`)
5. **End with a conclusion** or call-to-action

### Writing Tips

- **Keep paragraphs short** (3-5 sentences)
- **Use bullet points** to make content scannable
- **Add examples** to illustrate concepts
- **Use bold** to emphasize key points
- **Include blockquotes** for important takeaways
- **Add code blocks** for technical content

### Formatting Guidelines

- Use blank lines between different elements (headings, paragraphs, lists)
- Be consistent with your list markers (`-` or `*`)
- Keep line length reasonable (wrap at ~80-100 characters for readability in editors)
- Use proper capitalization in headings

## Example Blog Post Structure

Here's a template for a well-structured blog post:

```markdown
# Your Compelling Title

Opening paragraph that hooks the reader and explains what they'll learn from this post. Make it engaging and relevant to their needs.

Continue with 2-3 paragraphs of introduction that set up the problem or topic you're addressing.

## Main Section 1

Content for your first major point. Use concrete examples and clear explanations.

### Subsection 1.1

Break down complex topics into digestible subsections.

**Key takeaway:** Use bold to highlight important points.

### Subsection 1.2

More detailed information with examples:

- Bullet point 1
- Bullet point 2
- Bullet point 3

## Main Section 2

Your second major point or topic.

> Use blockquotes for powerful quotes or key insights you want to stand out.

Practical examples help readers understand how to apply your advice:

1. Step one
2. Step two
3. Step three

## Main Section 3

Continue with additional sections as needed.

```javascript
// Include code examples when relevant
function practiceDaily() {
    return "Consistency is key!";
}
```

## Conclusion

Wrap up your main points and provide actionable next steps for the reader.
```

## Common Mistakes to Avoid

1. **Forgetting blank lines**: Always add blank lines between headings, paragraphs, and lists
2. **Inconsistent formatting**: Stick to one style for lists, emphasis, etc.
3. **Overusing formatting**: Don't make everything bold or italic
4. **Missing heading hierarchy**: Don't skip from `#` to `###`
5. **Unclear link text**: Use descriptive text like "read the guide" instead of "click here"

## Testing Your Blog Post

1. Save your `.md` file in the `/blog` folder
2. Add the entry to `blog-loader.js`
3. Run a local server: `python3 -m http.server 8000`
4. Open `http://localhost:8000/blog.html` in your browser
5. Click on your post to see how it renders
6. Check for formatting issues and adjust as needed

## Additional Resources

- [Markdown Guide](https://www.markdownguide.org/) - Comprehensive markdown reference
- [GitHub Markdown Documentation](https://docs.github.com/en/get-started/writing-on-github) - Extended syntax
- [Daring Fireball](https://daringfireball.net/projects/markdown/) - Original markdown specification

## Quick Reference

| You want... | You type... | You get... |
|-------------|-------------|------------|
| Heading 1 | `# Heading` | <h1>Heading</h1> |
| Heading 2 | `## Heading` | <h2>Heading</h2> |
| Bold | `**bold**` | **bold** |
| Italic | `*italic*` | *italic* |
| Link | `[text](url)` | [text](url) |
| Image | `![alt](url)` | ![alt](url) |
| Code | `` `code` `` | `code` |
| Bullet list | `- item` | • item |
| Numbered list | `1. item` | 1. item |
| Blockquote | `> quote` | <blockquote>quote</blockquote> |
| Horizontal rule | `---` | <hr> |

---

Happy writing! If you have questions about markdown syntax, refer back to this guide or check the additional resources listed above.
