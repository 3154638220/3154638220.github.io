const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const mk = require('markdown-it-katex');

let hljs = null;
try {
  hljs = require('highlight.js');
} catch (_) {}

// 构建脚本在 scripts/ 下，项目根目录为其上一级
const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'article-template.html');
const VENDOR_DIR = path.join(ROOT, 'vendor');

// 构建前复制 KaTeX（CSS + 字体）与代码高亮 CSS 到 vendor，便于离线与 file:// 访问
if (!fs.existsSync(VENDOR_DIR)) {
  fs.mkdirSync(VENDOR_DIR, { recursive: true });
}
const katexDist = path.join(ROOT, 'node_modules', 'katex', 'dist');
const katexCss = path.join(katexDist, 'katex.min.css');
if (fs.existsSync(katexCss)) {
  fs.copyFileSync(katexCss, path.join(VENDOR_DIR, 'katex.min.css'));
  // KaTeX CSS 通过 url(fonts/xxx.woff2) 引用字体，必须同时复制 fonts 目录
  const katexFonts = path.join(katexDist, 'fonts');
  const vendorFonts = path.join(VENDOR_DIR, 'fonts');
  if (fs.existsSync(katexFonts)) {
    if (!fs.existsSync(vendorFonts)) fs.mkdirSync(vendorFonts, { recursive: true });
    for (const name of fs.readdirSync(katexFonts)) {
      fs.copyFileSync(path.join(katexFonts, name), path.join(vendorFonts, name));
    }
  }
}
if (hljs) {
  const hlTheme = path.join(ROOT, 'node_modules', 'highlight.js', 'styles', 'github-dark.min.css');
  if (fs.existsSync(hlTheme)) {
    fs.copyFileSync(hlTheme, path.join(VENDOR_DIR, 'highlight.min.css'));
  }
}

// 初始化 markdown-it：KaTeX 公式 + 代码高亮
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    const escape = (s) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (hljs && lang && hljs.getLanguage(lang)) {
      try {
        const result = hljs.highlight(str, { language: lang, ignoreIllegals: true });
        return `<pre class="code-block"><code class="hljs language-${lang}">${result.value}</code></pre>`;
      } catch (_) {}
    }
    const code = escape(str);
    return `<pre class="code-block"><code class="language-${lang || 'text'}">${code}</code></pre>`;
  }
}).use(mk);

// 将 {% fold xxx %} ... {% endfold %} 转为 <details><summary>
function preprocessFold(content) {
  return content
    .replace(/\{%\s*fold\s+([^%]+)\s*%\}/g, '<details class="fold-block"><summary>$1</summary>')
    .replace(/\{%\s*endfold\s*%\}/g, '</details>');
}

// 提取摘要（<!--more--> 之前的内容）
function getExcerpt(content, maxLen = 200) {
  const moreIndex = content.indexOf('<!--more-->');
  let text = moreIndex >= 0 ? content.slice(0, moreIndex) : content;
  text = text.replace(/[#*`$\[\]()]/g, '').replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

// 估算阅读时间（字符数 / 400 字/分钟，中文约 400 字/分钟）
function getReadingTime(content) {
  const text = content.replace(/[#*`$\[\]()\s]/g, '').replace(/<!--.*?-->/gs, '');
  const len = text.length;
  const mins = Math.max(1, Math.ceil(len / 400));
  return mins;
}

// 读取模板
const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// 确保输出目录存在
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
}

// 读取所有 md 文件
const mdFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
const posts = [];

for (const file of mdFiles) {
  const filePath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);

  const title = frontmatter.title || file.replace(/\.md$/, '');
  const date = frontmatter.date ? new Date(frontmatter.date).toISOString().slice(0, 10) : '';
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags ? [frontmatter.tags] : []);
  const categories = frontmatter.categories || '';

  // 预处理 fold 语法
  const processed = preprocessFold(content);
  const html = md.render(processed);
  const excerpt = getExcerpt(content);
  const readingMins = getReadingTime(content);

  const slug = file.replace(/\.md$/, '');
  const htmlFile = slug + '.html';

  const htmlContent = template
    .replace(/\{\{TITLE\}\}/g, escapeHtml(title))
    .replace(/\{\{DATE\}\}/g, date)
    .replace(/\{\{READING_TIME\}\}/g, String(readingMins))
    .replace('{{BODY}}', html)
    .replace(/\{\{META_DESCRIPTION\}\}/g, escapeHtml(excerpt));

  fs.writeFileSync(path.join(ARTICLES_DIR, htmlFile), htmlContent, 'utf-8');

  posts.push({
    title,
    date,
    slug,
    htmlFile,
    excerpt,
    tags,
    categories,
    readingMins
  });
}

// 按日期倒序
posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

// 写入 posts.json
fs.writeFileSync(
  path.join(ROOT, 'posts.json'),
  JSON.stringify(posts, null, 2),
  'utf-8'
);

// 将文章列表直接注入 blog.html，避免 file:// 下 fetch 被阻止
const blogListHtml = posts.map(p => `
          <article class="blog-card">
            <time datetime="${p.date}">${p.date}</time>
            <span class="blog-reading-time">约 ${p.readingMins} 分钟</span>
            <h3><a href="articles/${p.htmlFile}">${escapeHtml(p.title)}</a></h3>
            <p>${escapeHtml(p.excerpt)}</p>
          </article>`).join('');
const blogPath = path.join(ROOT, 'blog.html');
let blogContent = fs.readFileSync(blogPath, 'utf-8');
blogContent = blogContent.replace('<!-- BLOG_LIST -->', blogListHtml);
fs.writeFileSync(blogPath, blogContent, 'utf-8');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

console.log(`✓ 已生成 ${posts.length} 篇文章到 articles/`);
console.log(`✓ 已生成 posts.json`);
