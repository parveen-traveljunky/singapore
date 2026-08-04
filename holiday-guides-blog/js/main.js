/**
 * Holiday Guides Blog - Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initReadingProgress();
  initTableOfContents();
  initSocialSharing();
  initSearchAndFilter();
});

function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('hg_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('hg_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;
  themeToggleBtn.innerHTML = theme === 'dark' 
    ? '<i class="fas fa-sun"></i>' 
    : '<i class="fas fa-moon"></i>';
}

function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

function initTableOfContents() {
  const tocList = document.getElementById('toc-list');
  const articleBody = document.querySelector('.article-body');
  if (!tocList || !articleBody) return;

  const headings = articleBody.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    const tocBox = document.querySelector('.toc-box');
    if (tocBox) tocBox.style.display = 'none';
    return;
  }

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index + 1}`;
    }

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    
    if (heading.tagName.toLowerCase() === 'h3') {
      li.style.paddingLeft = '1rem';
      li.style.fontSize = '0.9rem';
    }

    li.appendChild(a);
    tocList.appendChild(li);
  });
}

function initSocialSharing() {
  const shareButtons = document.querySelectorAll('.share-btn');
  const currentUrl = encodeURIComponent(window.location.href);
  const currentTitle = encodeURIComponent(document.title);

  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (btn.classList.contains('tw')) {
        window.open(`https://twitter.com/intent/tweet?url=${currentUrl}&text=${currentTitle}`, '_blank');
      } else if (btn.classList.contains('fb')) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank');
      } else if (btn.classList.contains('wa')) {
        window.open(`https://api.whatsapp.com/send?text=${currentTitle}%20${currentUrl}`, '_blank');
      } else if (btn.classList.contains('ln')) {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`, '_blank');
      } else if (btn.classList.contains('copy')) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const originalIcon = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => btn.innerHTML = originalIcon, 2000);
        });
      }
    });
  });
}

function initSearchAndFilter() {
  const searchInput = document.getElementById('search-input');
  const categoryPills = document.querySelectorAll('.category-pill');
  const articleCards = document.querySelectorAll('.article-card');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterArticles() {
    articleCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.card-excerpt')?.textContent.toLowerCase() || '';

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = title.includes(searchQuery) || excerpt.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterArticles();
    });
  }

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category') || 'all';
      filterArticles();
    });
  });
}
