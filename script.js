// 移动端导航切换
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('active');
});

// 点击导航链接后关闭移动端菜单
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// 根据当前 URL 高亮导航项
function initNavActive() {
  const links = document.querySelectorAll('.nav-links a');
  if (!links.length) return;
  const path = (location.pathname || location.href).replace(/\\/g, '/').replace(/\/$/, '') || '/';
  const basename = path.split('/').pop() || 'index.html';
  links.forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href') || '';
    const linkBasename = href.split('/').pop();
    if (basename === linkBasename || (basename === 'index.html' && (linkBasename === 'index.html' || href === '../index.html'))) {
      a.classList.add('active');
    } else if (path.includes('/articles/') && (linkBasename === 'blog.html' || href.includes('blog.html'))) {
      a.classList.add('active');
    }
  });
}
initNavActive();

// 主题切换（暗色/亮色）
function initThemeToggle() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  function updateIcon() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    btn.innerHTML = isLight ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  }
  updateIcon();
  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
    updateIcon();
  });
}

// 文章页：搜索 + 按时间排序
function initBlogSearch() {
  const listEl = document.getElementById('blog-list');
  const searchInput = document.getElementById('blog-search');
  const sortSelect = document.getElementById('blog-sort');
  if (!listEl || !searchInput || !sortSelect) return;

  const cards = Array.from(listEl.querySelectorAll('.blog-card'));
  const getData = (el) => {
    const timeEl = el.querySelector('time');
    const titleEl = el.querySelector('h3 a');
    const excerptEl = el.querySelector('p');
    return {
      el,
      date: timeEl?.getAttribute('datetime') || '',
      title: (titleEl?.textContent || '').trim(),
      excerpt: (excerptEl?.textContent || '').trim()
    };
  };

  function applyFilterAndSort() {
    const keyword = searchInput.value.trim().toLowerCase();
    const order = sortSelect.value;

    let items = cards.map(getData);
    if (keyword) {
      items = items.filter(({ title, excerpt }) =>
        title.toLowerCase().includes(keyword) || excerpt.toLowerCase().includes(keyword)
      );
    }
    items.sort((a, b) => {
      const d = (a.date || '').localeCompare(b.date || '');
      return order === 'newest' ? -d : d;
    });

    listEl.replaceChildren(...items.map(({ el }) => el));
  }

  searchInput.addEventListener('input', applyFilterAndSort);
  searchInput.addEventListener('keyup', applyFilterAndSort);
  searchInput.addEventListener('compositionend', applyFilterAndSort);
  sortSelect.addEventListener('change', applyFilterAndSort);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBlogSearch);
} else {
  initBlogSearch();
}

// 文章页：阅读进度条
function initReadProgress() {
  const articleBody = document.querySelector('.article-body');
  if (!articleBody) return;
  const bar = document.createElement('div');
  bar.className = 'read-progress';
  document.body.insertBefore(bar, document.body.firstChild);
  function update() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const total = scrollHeight - clientHeight;
    const pct = total > 0 ? (scrollTop / total) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// 文章页：复制代码块
function initCopyCode() {
  document.querySelectorAll('.article-body pre, .article-body .code-block').forEach(pre => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.textContent = '复制';
    btn.setAttribute('aria-label', '复制代码');
    wrapper.appendChild(btn);
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText || pre.innerText;
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = '已复制';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 1500);
      } catch (_) {}
    });
  });
}

// 文章页：TOC 目录
function initToc() {
  const body = document.querySelector('.article-body');
  if (!body) return;
  const headings = body.querySelectorAll('h2, h3');
  if (headings.length < 2) return;
  const toc = document.createElement('nav');
  toc.className = 'article-toc';
  toc.innerHTML = '<div class="article-toc-title">目录</div><ul class="article-toc-list"></ul>';
  const list = toc.querySelector('ul');
  headings.forEach((h, i) => {
    const id = h.id || `toc-${i}`;
    if (!h.id) h.id = id;
    const li = document.createElement('li');
    if (h.tagName === 'H3') li.classList.add('toc-h3');
    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = h.textContent.trim();
    li.appendChild(a);
    list.appendChild(li);
  });
  const article = document.querySelector('.article-page');
  if (!article) return;
  const container = document.createElement('div');
  container.className = 'article-with-toc';
  const header = article.querySelector('.article-header');
  const footer = article.querySelector('.article-footer');
  const bodyWrap = document.createElement('div');
  bodyWrap.appendChild(header);
  bodyWrap.appendChild(body);
  if (footer) bodyWrap.appendChild(footer);
  container.appendChild(toc);
  container.appendChild(bodyWrap);
  article.innerHTML = '';
  article.appendChild(container);
  list.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(a.getAttribute('href').slice(1));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });
  function updateActive() {
    const rects = [...headings].map(h => ({ el: h, top: h.getBoundingClientRect().top }));
    const scrollY = window.scrollY;
    let active = headings[0];
    for (const { el, top } of rects) {
      if (top <= 100) active = el;
    }
    list.querySelectorAll('a').forEach((a, i) => {
      a.classList.toggle('active', headings[i] === active);
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

// 回到顶部按钮
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', '回到顶部');
  btn.innerHTML = '<span class="back-to-top-icon" aria-hidden="true">↑</span>';
  document.body.appendChild(btn);

  const showThreshold = 300;
  function updateVisibility() {
    if (window.scrollY > showThreshold) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initArticlePage() {
  initReadProgress();
  initCopyCode();
  initToc();
}
initThemeToggle();

// 首页终端：假命令逐行出现
function initTerminalCommands() {
  const body = document.getElementById('terminal-body');
  if (!body) return;
  const dynamicLine = body.querySelector('.code-line-dynamic');
  if (!dynamicLine) return;
  const commands = [
    '<span class="code-string">$</span> npm run deploy',
    '<span class="code-string">$</span> git push origin main'
  ];
  let idx = 0;
  function addLine() {
    if (idx >= commands.length) return;
    const div = document.createElement('div');
    div.className = 'code-line';
    div.innerHTML = commands[idx];
    dynamicLine.parentNode.insertBefore(div, dynamicLine);
    idx++;
    if (idx < commands.length) setTimeout(addLine, 1200);
  }
  setTimeout(addLine, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    initArticlePage();
    initTerminalCommands();
  });
} else {
  initBackToTop();
  initArticlePage();
  initTerminalCommands();
}
