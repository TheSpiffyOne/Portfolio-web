document.addEventListener('DOMContentLoaded', () => {
  const picker = document.querySelector('.picker-container');
  if (!picker) return;

  const buttons = Array.from(picker.querySelectorAll('.picker-option'));
  const uiNavs = Array.from(document.querySelectorAll('.catalog-UI'));
  const logosNavs = Array.from(document.querySelectorAll('.catalog-logo'));

  // Guard: if neither section exists, don't attempt filtering — just keep the picker usable visually
  if (uiNavs.length === 0 && logosNavs.length === 0) {
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    if (buttons[0]) buttons[0].classList.add('active');
    return;
  }

  function setFilter(filter) {
    buttons.forEach(btn => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Determine visibility for each kind of nav
    const showUi = filter === 'all' || filter === 'uiux';
    const showLogos = filter === 'all' || filter === 'logos';

    // Apply to all matched elements (fixes previous bug of only affecting the first matched element)
    uiNavs.forEach(el => {
      el.style.display = showUi ? '' : 'none';
      // keep accessibility in sync
      el.setAttribute('aria-hidden', showUi ? 'false' : 'true');
    });

    logosNavs.forEach(el => {
      el.style.display = showLogos ? '' : 'none';
      el.setAttribute('aria-hidden', showLogos ? 'false' : 'true');
    });
  }

  // Wire up clicks + keyboard accessible activation
  buttons.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    btn.addEventListener('keydown', (e) => {
      // handle Enter and Space (some browsers use " " or "Spacebar"/"Space")
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'Space') {
        e.preventDefault();
        setFilter(btn.dataset.filter);
      }
    });
  });

  // Initialize to 'all'
  setFilter('all');
});