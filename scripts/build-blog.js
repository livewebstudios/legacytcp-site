const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, '_posts');
const BLOG_DIR = path.join(ROOT, 'blog');
const TEMPLATES_DIR = path.join(ROOT, '_templates');

// ── Helpers ──────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function isoDate(dateStr) {
  return new Date(dateStr).toISOString();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Read & parse posts ───────────────────────────────────────

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const slug = path.basename(file, '.md');
    const html = marked(content);

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      category: data.category || 'Company News',
      description: data.description || '',
      thumbnail: data.thumbnail || '',
      html
    };
  });

  // Sort newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

// ── Generate sidebar HTML ────────────────────────────────────

function buildSidebar(posts) {
  // Recent posts (up to 5)
  const recentItems = posts.slice(0, 5).map(p =>
    `<div class="recent-post-item"><a href="/blog/${p.slug}/">${escapeHtml(p.title)}</a></div>`
  ).join('\n            ');

  // Unique categories sorted alphabetically
  const categories = [...new Set(posts.map(p => p.category))].sort();
  const categoryItems = categories.map(c =>
    `<a href="/blog/#${slugify(c)}">${escapeHtml(c)}</a>`
  ).join('\n            ');

  return `<div class="sidebar-widget">
            <div class="sidebar-widget-title">Recent Posts</div>
            ${recentItems}
          </div>
          <div class="sidebar-widget">
            <div class="sidebar-widget-title">Categories</div>
            <div class="category-list">
            ${categoryItems}
            </div>
          </div>`;
}

// ── Generate blog card HTML ──────────────────────────────────

function buildCard(post) {
  const imageBlock = post.thumbnail
    ? `<img src="${escapeHtml(post.thumbnail)}" alt="${escapeHtml(post.title)}">`
    : `<div class="card-no-img"><span>${escapeHtml(post.category)}</span></div>`;

  return `
          <div class="blog-post-card">
            ${imageBlock}
            <div class="card-body">
              <div class="card-meta">${escapeHtml(post.category)}</div>
              <h2 class="card-title"><a href="/blog/${post.slug}/">${escapeHtml(post.title)}</a></h2>
              <p class="card-excerpt">${escapeHtml(post.description)}</p>
              <a href="/blog/${post.slug}/" class="card-read-more">Read More &rarr;</a>
            </div>
          </div>`;
}

// ── Build individual post pages ──────────────────────────────

function buildPostPages(posts, sidebar) {
  const template = fs.readFileSync(path.join(TEMPLATES_DIR, 'blog-post.html'), 'utf8');

  posts.forEach(post => {
    const heroImage = post.thumbnail || '/images/about-us.jpg';
    const ogImage = post.thumbnail
      ? `https://legacytcp.com${post.thumbnail}`
      : 'https://legacytcp.com/images/about-us.jpg';

    let html = template
      .replace(/\{\{TITLE\}\}/g, escapeHtml(post.title))
      .replace(/\{\{DESCRIPTION\}\}/g, escapeHtml(post.description))
      .replace(/\{\{SLUG\}\}/g, post.slug)
      .replace(/\{\{CATEGORY\}\}/g, escapeHtml(post.category))
      .replace(/\{\{DATE_FORMATTED\}\}/g, formatDate(post.date))
      .replace(/\{\{DATE_ISO\}\}/g, isoDate(post.date))
      .replace(/\{\{HERO_IMAGE\}\}/g, heroImage)
      .replace(/\{\{OG_IMAGE\}\}/g, ogImage)
      .replace(/\{\{CONTENT\}\}/g, post.html)
      .replace(/\{\{SIDEBAR\}\}/g, sidebar);

    const outDir = path.join(BLOG_DIR, post.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  });
}

// ── Build blog listing page ──────────────────────────────────

function buildIndexPage(posts, sidebar) {
  const template = fs.readFileSync(path.join(TEMPLATES_DIR, 'blog-index.html'), 'utf8');

  const cards = posts.length > 0
    ? posts.map(buildCard).join('\n')
    : `<div style="grid-column:1/-1; text-align:center; padding:60px 20px;">
            <p style="font-family:var(--font-head); font-size:18px; color:var(--text-mid);">New articles coming soon. Check back shortly.</p>
          </div>`;

  const html = template
    .replace(/\{\{BLOG_CARDS\}\}/g, cards)
    .replace(/\{\{SIDEBAR\}\}/g, sidebar);

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), html, 'utf8');
}

// ── Main ─────────────────────────────────────────────────────

function main() {
  console.log('Building blog...');

  const posts = loadPosts();
  console.log(`  Found ${posts.length} post(s) in _posts/`);

  const sidebar = buildSidebar(posts);

  // Clean previous build
  if (fs.existsSync(BLOG_DIR)) {
    fs.rmSync(BLOG_DIR, { recursive: true, force: true });
  }

  buildIndexPage(posts, sidebar);
  console.log('  Built /blog/index.html');

  if (posts.length > 0) {
    buildPostPages(posts, sidebar);
    posts.forEach(p => console.log(`  Built /blog/${p.slug}/index.html`));
  }

  console.log('Blog build complete.');
}

main();
