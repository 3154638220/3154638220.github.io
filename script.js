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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackToTop);
} else {
  initBackToTop();
}
