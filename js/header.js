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

  // Compute the vertical offset at which the tab bar should become sticky.
  // We capture it once and update on resize/orientationchange.
  let stickyOffset = tabbar.getBoundingClientRect().top + window.scrollY;

  // rAF-based throttle to avoid rapid toggles and layout thrashing on mobile.
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const shouldBeSticky = window.scrollY >= stickyOffset;
      tabbar.classList.toggle('sticky', shouldBeSticky);
      ticking = false;
    });
  }

  // Recompute offset on resize/orientationchange (mobile browser chrome can change).
  function recomputeOffset() {
    // Small timeout to allow layout changes to settle (helps on some mobile browsers).
    setTimeout(() => {
      stickyOffset = tabbar.getBoundingClientRect().top + window.scrollY;
      // Update state immediately after recomputing so UI stays consistent.
      const shouldBeSticky = window.scrollY >= stickyOffset;
      tabbar.classList.toggle('sticky', shouldBeSticky);
    }, 50);
  }

  // Attach listeners (passive where appropriate).
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', recomputeOffset, { passive: true });
  window.addEventListener('orientationchange', recomputeOffset, { passive: true });

  // In case fonts/images change layout after load, ensure offset is correct once all is idle.
  window.requestAnimationFrame(recomputeOffset);
});