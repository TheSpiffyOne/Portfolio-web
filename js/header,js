
// Disable automatic scroll restoration (for browsers that support it)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// Prevent auto-scrolling to anchor on page refresh
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
  window.scrollTo(0, 0);
}

const tabbar = document.querySelector('.tab-bar');
const spacer = document.querySelector('.spacer');

const observer = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) {
      tabbar.classList.add('sticky');
    } else {
      tabbar.classList.remove('sticky');
    }
  },
  {
    rootMargin: '-1px 0px 0px 0px',
    threshold: 0
  }
);

observer.observe(spacer);