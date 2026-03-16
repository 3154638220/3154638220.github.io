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

// 首页：锚点平滑滚动
function initHomeAnchorScroll() {
  if (!document.body.classList.contains('page-home')) return;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const hash = a.getAttribute('href');
    if (hash === '#') return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', hash);
      }
    });
  });
  // 页面加载时若有 hash，滚动到对应区块
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
}

// 根据当前 URL 或滚动位置高亮导航项
function initNavActive() {
  const links = document.querySelectorAll('.nav-links a');
  if (!links.length) return;
  const path = (location.pathname || location.href).replace(/\\/g, '/').replace(/\/$/, '') || '/';
  const basename = path.split('/').pop() || 'index.html';
  const isHome = basename === 'index.html' || basename === '' || path.endsWith('/');

  function updateActiveByPath() {
    links.forEach(a => {
      a.classList.remove('active');
      const href = a.getAttribute('href') || '';
      const linkBasename = (href.split('#')[0] || '').split('/').pop();
      const hash = (href.split('#')[1] || '').toLowerCase();
      if (isHome && hash) {
        const curHash = (location.hash || '#home').slice(1).toLowerCase();
        if (hash === curHash) a.classList.add('active');
      } else if (basename === linkBasename || (basename === 'index.html' && (linkBasename === 'index.html' || href === '../index.html'))) {
        a.classList.add('active');
      } else if (path.includes('/articles/') && (linkBasename === 'blog.html' || href.includes('blog.html'))) {
        a.classList.add('active');
      }
    });
  }

  function updateActiveByScroll() {
    if (!document.body.classList.contains('page-home')) return;
    const sections = document.querySelectorAll('.fullpage-section');
    if (!sections.length) return;
    const vh = window.innerHeight;
    const scrollY = window.scrollY;
    let activeId = 'home';
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollY >= top - vh * 0.3) activeId = sec.id || 'home';
    });
    links.forEach(a => {
      a.classList.remove('active');
      const hash = (a.getAttribute('href') || '').split('#')[1];
      if (hash && hash.toLowerCase() === activeId) a.classList.add('active');
    });
  }

  updateActiveByPath();
  if (isHome) {
    window.addEventListener('scroll', updateActiveByScroll, { passive: true });
    window.addEventListener('hashchange', updateActiveByPath);
  }
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

// 文章页：代码高亮（动态加载 highlight.js，无需重新构建文章）
function runCodeHighlight() {
  const body = document.querySelector('.article-body');
  if (!body || typeof hljs === 'undefined') return;
  const langAliases = { py: 'python', 'c++': 'cpp', 'c#': 'csharp', js: 'javascript', ts: 'typescript' };
  body.querySelectorAll('pre code[class*="language-"]').forEach(codeEl => {
    if (codeEl.classList.contains('hljs')) return;
    const m = codeEl.className.match(/language-(\S+)/);
    const lang = m ? (langAliases[m[1]] || m[1]) : null;
    let text;
    const lines = codeEl.querySelectorAll('.code-line');
    if (lines.length) {
      text = [...lines].map(l => {
        const clone = l.cloneNode(true);
        const num = clone.querySelector('.line-num');
        if (num) num.remove();
        return clone.textContent.replace(/\s+$/, '');
      }).join('\n');
    } else {
      text = codeEl.textContent;
    }
    if (!text) return;
    try {
      const result = lang && hljs.getLanguage(lang)
        ? hljs.highlight(text, { language: lang, ignoreIllegals: true })
        : hljs.highlightAuto(text);
      codeEl.innerHTML = result.value;
      codeEl.classList.add('hljs', 'language-' + (result.language || 'plaintext'));
    } catch (_) {}
  });
}

function initCodeHighlight() {
  const body = document.querySelector('.article-body');
  if (!body || !body.querySelector('pre code[class*="language-"]')) return;
  if (typeof hljs !== 'undefined') {
    runCodeHighlight();
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
  script.crossOrigin = 'anonymous';
  script.onload = runCodeHighlight;
  document.body.appendChild(script);
}

// 文章页：复制代码块（图标）
const COPY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const COPIED_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

function initCopyCode() {
  document.querySelectorAll('.article-body pre, .article-body .code-block').forEach(pre => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.innerHTML = COPY_ICON;
    btn.setAttribute('aria-label', '复制代码');
    wrapper.appendChild(btn);
    btn.addEventListener('click', async () => {
      const codeEl = pre.querySelector('code');
      let code;
      if (codeEl) {
        const lines = codeEl.querySelectorAll('.code-line');
        if (lines.length) {
          code = [...lines].map(l => {
            const clone = l.cloneNode(true);
            const num = clone.querySelector('.line-num');
            if (num) num.remove();
            return clone.textContent.replace(/\s+$/, '');
          }).join('\n');
        } else {
          code = codeEl.innerText;
        }
      } else {
        code = pre.innerText;
      }
      try {
        await navigator.clipboard.writeText(code || '');
        btn.innerHTML = COPIED_ICON;
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = COPY_ICON; btn.classList.remove('copied'); }, 1500);
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
    btn.classList.add('scrolling');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      btn.classList.remove('scrolling');
      window.removeEventListener('scroll', onScroll);
    };
    const onScroll = () => { if (window.scrollY < 10) finish(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(finish, 600);
  });
}

function initArticlePage() {
  initReadProgress();
  initCodeHighlight();
  initCopyCode();
  initToc();
}
initThemeToggle();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    initArticlePage();
    initHomeAnchorScroll();
  });
} else {
  initBackToTop();
  initArticlePage();
  initHomeAnchorScroll();
}
