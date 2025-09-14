document.addEventListener('DOMContentLoaded', () => {
  const langDropdown = document.getElementById('language-dropdown');
  const translatableElements = document.querySelectorAll('[data-en], [data-ru]');
  let currentLang = 'en'; // Default language

  // Function to change the language
  const changeLanguage = (lang) => {
    currentLang = lang;
    translatableElements.forEach(element => {
      const translation = element.getAttribute(`data-${lang}`);
      if (translation) {
        element.textContent = translation;
      }
    });
    localStorage.setItem('lang', lang); // Save language preference
  };

  // Check for saved language preference in local storage
  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
    langDropdown.value = savedLang;
    changeLanguage(savedLang);
  }

  // Add event listener to the dropdown
  langDropdown.addEventListener('change', (event) => {
    const lang = event.target.value;
    changeLanguage(lang);
  });
});