document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const style = document.querySelectorAll('.style');
  
  if (!navbar) {
    console.error('Navbar element not found. Check selector.');
    return;
  }

  let navbarOffset = navbar.offsetTop;

  window.addEventListener('resize', () => {
    navbarOffset = navbar.offsetTop;
  });

  window.addEventListener('scroll', () => {
    const isSticky = window.pageYOffset >= navbarOffset;
    
    // Toggle navbar sticky class
    navbar.classList.toggle('stickies', isSticky);
    
    // Toggle style-2 class on all style elements based on sticky state
    style.forEach(el => {
      el.classList.toggle('style-2', isSticky);
    });
  });
});