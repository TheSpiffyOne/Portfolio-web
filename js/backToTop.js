// Back-to-top handler: use pointerdown to catch first-touch on mobile,
// fall back to click. Prevent double-trigger (pointerdown + click).
document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.back-to-top');
  if (!el) return;

  // Make element keyboard-focusable / accessible if it's an <a> without href
  if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', 'Back to top');

  let recentPointer = false;

  function scrollToTop() {
    // Use smooth behavior where available.
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      window.scrollTo(0, 0);
    }
  }

  function onPointerDown(e) {
    // Prevent potential default navigation if element is an anchor.
    e.preventDefault();
    recentPointer = true;
    scrollToTop();
    // clear flag shortly after so a following click won't re-trigger
    setTimeout(() => (recentPointer = false), 700);
  }

  function onClick(e) {
    // If pointerdown already handled the gesture, skip the click.
    if (recentPointer) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    scrollToTop();
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      scrollToTop();
    }
  }

  // pointerdown covers touch, pen and mouse in modern browsers.
  el.addEventListener('pointerdown', onPointerDown, { passive: false });
  el.addEventListener('click', onClick, { passive: false });
  el.addEventListener('keydown', onKeyDown);
});