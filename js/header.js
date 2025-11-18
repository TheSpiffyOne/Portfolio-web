// Wait until DOM is ready so the element exists
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar'); // use valid selector
  const style = document.querySelectorAll('.style');
  if (!navbar) {
    console.error('Navbar element not found. Check selector.');
    return;
  }

  // compute offset after layout — store initial value
  let navbarOffset = navbar.offsetTop;

  // Recompute on resize in case layout changes
  window.addEventListener('resize', () => {
    navbarOffset = navbar.offsetTop;
  });

  window.addEventListener('scroll', () => {
    if (window.pageYOffset >= navbarOffset) {
      navbar.classList.add('stickies');
    } else {
      navbar.classList.remove('stickies');
    }
  });

  style.forEach(el => {
  if (navbar.classList.contains('stickies')) {
    el.classList.add('style-2');
  } else {
    el.classList.remove('style-2');
  }
});

});

