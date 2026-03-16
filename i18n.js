/**
 * i18n - 中英文切换
 * 使用 data-i18n="key" 标记需翻译的文本，data-i18n-placeholder="key" 标记 placeholder
 */
(function () {
  const STORAGE_KEY = 'site-lang';

  const I18N = {
    en: {
      nav: { home: 'Home', about: 'About', projects: 'Projects', blog: 'Blog', contact: 'Contact', games: 'Games' },
      aria: { theme: 'Toggle theme', menu: 'Menu', copyCode: 'Copy code', backToTop: 'Back to top' },
      hero: {
        subtitle: 'Developer',
        subtitle2: 'Creator',
        terminalFuture: '"future"',
        taglines: [
          'Explore · Create · Iterate',
          'Build things · Ship fast · Learn always',
          'Code · Create · Iterate',
          'Turning ideas into reality, one line at a time',
          'Debug · Deploy · Dream',
          'Think · Build · Ship',
          'Design · Develop · Deploy',
          'Learn · Build · Share',
          'Simplifying complexity · Creating solutions',
          'Crafting code · Building the future',
          'Explore technology · Create with code · Iterate continuously'
        ]
      },
      section: { aboutMe: 'About Me', projects: 'Projects', latestPosts: 'Latest Posts', contact: 'Contact', games: 'Games' },
      btn: {
        viewProjects: 'View Projects',
        contactMe: 'Contact Me',
        viewAllPosts: 'View All Posts →',
        playGames: 'Play Games →',
        backToHome: '← Back to Home',
        backToBlog: '← Back to Blog'
      },
      blog: {
        searchPlaceholder: 'Search title or summary...',
        searchAria: 'Search posts',
        sortAria: 'Sort by time',
        newest: 'Newest first',
        oldest: 'Oldest first'
      },
      contact: { intro: 'Feel free to reach out:', email: 'Email' },
      project: {
        personalWebsite: 'Personal Website',
        personalWebsiteDesc: 'Source of this site. A minimal personal website template built with pure HTML/CSS/JavaScript, supporting Markdown article build and GitHub Pages deployment.',
        viewProject: 'View Project →'
      },
      game: {
        intro: 'Take a break and play: Shooting, 2048, Reaction Speed Test.',
        shooting: 'Shooting',
        shootingDesc: 'Move mouse to aim, click to shoot targets',
        merge2048: 'Merge same numbers, reach 2048',
        reaction: 'Reaction',
        reactionTitle: 'Reaction Speed',
        reactionDesc: 'Test your reaction time',
        duration: 'Duration: ',
        score: 'Score: ',
        left: 'Left: ',
        time: 'Time: ',
        startGame: 'Start Game',
        end: 'End',
        clickToBegin: 'Click "Start Game" to begin',
        playAgain: 'Play Again',
        useKeys: 'Use arrow keys or WASD to move tiles. Merge same numbers. Reach 2048!',
        best: 'Best: ',
        newGame: 'New Game',
        gameOver: 'Game Over',
        reactionDesc2: 'Wait for the screen to turn green, then click immediately to test your reaction speed!',
        avg: 'Avg: ',
        count: 'Count: ',
        startTest: 'Start Test',
        clickHint: 'Click "Start Test" then wait for green and click',
        waitGreen: 'Wait for green...',
        click: 'Click!',
        tooEarly: 'Too early! Wait for green then click',
        nextRound: 'Click "Start Test" for next round',
        refLevels: 'Reference levels:',
        delay: 'Delay',
        level: 'Level',
        elite: 'Elite (pro gamers, race drivers)',
        excellent: 'Excellent (fast reaction)',
        average: 'Average (most people)',
        slow: 'Slow',
        verySlow: 'Very slow',
        timeUp: "Time's up! Final score:",
        gameOverScore: 'Game over. Score:',
        avgReaction: 'Avg reaction:',
        gameOverExclaim: 'Game Over!'
      },
      footer: { visitors: 'visitors', pageViews: 'page views' },
      page404: { title: 'Page Not Found', hint: '// Dead end. Try heading back home?' },
      toc: { title: 'Contents' }
    },
    zh: {
      nav: { home: '首页', about: '关于', projects: '项目', blog: '文章', contact: '联系', games: '小游戏' },
      aria: { theme: '切换主题', menu: '菜单', copyCode: '复制代码', backToTop: '回到顶部' },
      hero: {
        subtitle: '开发者',
        subtitle2: '创作者',
        terminalFuture: '"未来"',
        taglines: [
          '技术探索 · 代码创造 · 持续迭代',
          '构建产品 · 快速交付 · 持续学习',
          '编码 · 创造 · 迭代',
          '将想法变为现实，一行代码一行代码地',
          '调试 · 部署 · 梦想',
          '思考 · 构建 · 发布',
          '设计 · 开发 · 部署',
          '学习 · 构建 · 分享',
          '化繁为简 · 创造解决方案',
          '雕琢代码 · 构建未来',
          '探索技术 · 用代码创造 · 持续迭代'
        ]
      },
      section: { aboutMe: '关于我', projects: '项目展示', latestPosts: '最新文章', contact: '联系我', games: '小游戏' },
      btn: {
        viewProjects: '查看项目',
        contactMe: '联系我',
        viewAllPosts: '查看全部文章 →',
        playGames: '开始游戏 →',
        backToHome: '← 回首页',
        backToBlog: '← 返回文章列表'
      },
      blog: {
        searchPlaceholder: '搜索标题或摘要...',
        searchAria: '搜索文章',
        sortAria: '按时间排序',
        newest: '时间从新到旧',
        oldest: '时间从旧到新'
      },
      contact: { intro: '欢迎通过以下方式与我交流：', email: '邮箱' },
      project: {
        personalWebsite: '个人网站',
        personalWebsiteDesc: '本站源码，纯 HTML/CSS/JavaScript 构建的简洁个人网站模板，支持 Markdown 文章构建、GitHub Pages 部署。',
        viewProject: '查看项目 →'
      },
      game: {
        intro: '放松一下，玩玩小游戏：射击、2048、反应速度测试。',
        shooting: '射击',
        shootingDesc: '移动鼠标瞄准，点击射击目标',
        merge2048: '合并相同数字，挑战 2048',
        reaction: '反应速度',
        reactionTitle: '反应速度测试',
        reactionDesc: '测试你的反应时间',
        duration: '时长：',
        score: '得分: ',
        left: '剩余: ',
        time: '时间: ',
        startGame: '开始游戏',
        end: '结束',
        clickToBegin: '点击「开始游戏」开始',
        playAgain: '再玩一局',
        useKeys: '使用方向键或 WASD 移动方块，相同数字合并，目标是得到 2048！',
        best: '最高: ',
        newGame: '新游戏',
        gameOver: '游戏结束',
        reactionDesc2: '等待屏幕变绿后立即点击，测试你的反应速度！',
        avg: '平均: ',
        count: '次数: ',
        startTest: '开始测试',
        clickHint: '点击「开始测试」后等待变绿再点击',
        waitGreen: '等待变绿...',
        click: '点击！',
        tooEarly: '太早了！请等待变绿后再点击',
        nextRound: '点击「开始测试」继续下一轮',
        refLevels: '参考水平：',
        delay: '延迟',
        level: '水平',
        elite: '顶尖水平（职业电竞选手、赛车手级别）',
        excellent: '优秀（业余高手、反应较快）',
        average: '普通（大多数人水平）',
        slow: '偏慢',
        verySlow: '较慢',
        timeUp: '时间到！最终得分:',
        gameOverScore: '游戏结束，得分:',
        avgReaction: '平均反应延迟:',
        gameOverExclaim: '游戏结束！'
      },
      footer: { visitors: '人访问', pageViews: '次' },
      page404: { title: '页面未找到', hint: '// 此路不通，试试回首页？' },
      toc: { title: '目录' }
    }
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }

  function setLang(lang) {
    if (I18N[lang]) {
      localStorage.setItem(STORAGE_KEY, lang);
      applyLang(lang);
      if (typeof window.onLangChange === 'function') window.onLangChange(lang);
    }
  }

  function t(lang, key) {
    const keys = key.split('.');
    let v = I18N[lang];
    for (const k of keys) {
      v = v && v[k];
    }
    return v != null ? String(v) : key;
  }

  function applyLang(lang) {
    const strings = I18N[lang];
    if (!strings) return;

    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(lang, key);
      if (val) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(lang, key);
      if (val) el.placeholder = val;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const val = t(lang, key);
      if (val) el.setAttribute('aria-label', val);
    });

    document.querySelectorAll('[data-i18n-option]').forEach(el => {
      const key = el.getAttribute('data-i18n-option');
      const val = t(lang, key);
      if (val) el.textContent = val;
    });
  }

  window.i18n = {
    getLang,
    setLang,
    applyLang,
    t: (key) => t(getLang(), key),
    I18N
  };
})();
