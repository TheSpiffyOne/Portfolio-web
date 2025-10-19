// Disable automatic scroll restoration (for browsers that support it)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// Prevent auto-scrolling to anchor on page refresh
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
  window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
  const tabbar = document.querySelector('.tab-bar');
  if (!tabbar) return;

  // Create a placeholder that occupies the tab-bar's space when the tabbar is fixed
  const placeholder = document.createElement('div');
  placeholder.className = 'tabbar-placeholder';
  tabbar.parentNode.insertBefore(placeholder, tabbar);

  // Update placeholder height to match tabbar when sticky, or 0 when not sticky
  function updatePlaceholderHeight() {
    if (tabbar.classList.contains('sticky')) {
      placeholder.style.height = `${tabbar.offsetHeight}px`;
    } else {
      placeholder.style.height = '0px';
    }
  }

  // IntersectionObserver watches the placeholder: when it's not visible, make tabbar sticky.
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const shouldBeSticky = !entry.isIntersecting;
      tabbar.classList.toggle('sticky', shouldBeSticky);
      updatePlaceholderHeight();
    });
  }, { threshold: 0 });

  io.observe(placeholder);

  // Keep placeholder height in sync if tabbar's size changes (fonts, dynamic content, orientation).
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(updatePlaceholderHeight);
    ro.observe(tabbar);
  } else {
    // Fallback
    window.addEventListener('resize', () => setTimeout(updatePlaceholderHeight, 60), { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(updatePlaceholderHeight, 80), { passive: true });
  }

  // Ensure initial correct state once layout is ready.
  window.requestAnimationFrame(updatePlaceholderHeight);
});