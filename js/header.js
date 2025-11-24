document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const styleElems = document.querySelectorAll('.style');

  if (!navbar) {
    console.error('Navbar element not found. Check selector.');
    return;
  }

  let navbarOffset = navbar.offsetTop;

  // Recalculate when resizing
  window.addEventListener('resize', () => {
    navbar.classList.remove('stickies');       // remove sticky first
    styleElems.forEach(el => el.classList.remove('style-2'));

    navbarOffset = navbar.offsetTop;           // now measure correctly
  });

  window.addEventListener('scroll', () => {
    const isSticky = window.pageYOffset >= navbarOffset;

    navbar.classList.toggle('stickies', isSticky);
    styleElems.forEach(el => {
      el.classList.toggle('style-2', isSticky);
    });
  });
});
