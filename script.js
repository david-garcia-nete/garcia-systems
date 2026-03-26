document.addEventListener('DOMContentLoaded', () => {
  const desktopQuery = window.matchMedia('(min-width: 760px)');
  const languageStorageKey = 'garciaSystemsLanguage';
  const translations = {
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        contact: 'Contact',
        languageToggle: 'Español',
      },
      links: {
        home: '#home',
        about: '#about',
        services: '#services',
        contact: '#contact',
      },
      languageCode: 'es',
    },
    es: {
      nav: {
        home: 'Inicio',
        about: 'Nosotros',
        services: 'Servicios',
        contact: 'Contacto',
        languageToggle: 'English',
      },
      links: {
        home: '#home',
        about: '#about',
        services: '#servicios',
        contact: '#contact',
      },
      languageCode: 'en',
    },
  };

  const isSpanishPage = window.location.pathname.includes('/es/');
  const currentLanguage = isSpanishPage ? 'es' : 'en';

  const applyNavigationLanguage = (navBar, language) => {
    const navConfig = translations[language] || translations.en;
    const nav = navBar.querySelector('.nav');
    if (!nav) {
      return;
    }

    nav.querySelectorAll('[data-nav-item]').forEach((item) => {
      const key = item.getAttribute('data-nav-item');
      if (!key || !navConfig.nav[key]) {
        return;
      }

      item.textContent = navConfig.nav[key];

      if (key === 'languageToggle') {
        const href = language === 'es' ? '../index.html' : 'es/index.html';
        item.setAttribute('href', href);
        item.setAttribute('lang', navConfig.languageCode);
        return;
      }

      if (navConfig.links[key]) {
        item.setAttribute('href', navConfig.links[key]);
      }
    });
  };

  document.querySelectorAll('.nav-bar').forEach((navBar) => {
    const menuButton = navBar.querySelector('.menu-toggle');
    const nav = navBar.querySelector('.nav');
    applyNavigationLanguage(navBar, currentLanguage);

    if (!menuButton || !nav) {
      return;
    }

    const setMenuState = (isOpen) => {
      menuButton.setAttribute('aria-expanded', String(isOpen));
      nav.classList.toggle('is-open', isOpen);
    };

    setMenuState(false);

    menuButton.addEventListener('click', () => {
      if (desktopQuery.matches) {
        return;
      }

      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      setMenuState(!isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (link.classList.contains('lang-switch')) {
          localStorage.setItem(languageStorageKey, isSpanishPage ? 'en' : 'es');
        }

        if (!desktopQuery.matches) {
          setMenuState(false);
        }
      });
    });

    desktopQuery.addEventListener('change', (event) => {
      if (event.matches) {
        setMenuState(false);
      }
    });
  });
});
