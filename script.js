document.addEventListener('DOMContentLoaded', () => {
  const desktopQuery = window.matchMedia('(min-width: 760px)');
  const languageStorageKey = 'garciaSystemsLanguage';
  const sectionOrder = ['home', 'about', 'services', 'contact'];
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
        about: 'Sobre',
        services: 'Servicios',
        contact: 'Contacto',
        languageToggle: 'English',
      },
      links: {
        home: '#home',
        about: '#about',
        services: '#services',
        contact: '#contact',
      },
      languageCode: 'en',
    },
  };

  const isSpanishPage = window.location.pathname.includes('/es/');
  const currentLanguage = isSpanishPage ? 'es' : 'en';

  const setActiveNav = (nav, activeId) => {
    nav.querySelectorAll('[data-nav-item]').forEach((item) => {
      const key = item.getAttribute('data-nav-item');
      if (!key || key === 'languageToggle') {
        return;
      }

      const isActive = key === activeId;
      item.classList.toggle('is-active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  };

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

  const navBars = document.querySelectorAll('.nav-bar');

  navBars.forEach((navBar) => {
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
    setActiveNav(nav, 'home');

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

        const key = link.getAttribute('data-nav-item');
        if (key && sectionOrder.includes(key)) {
          setActiveNav(nav, key);
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

    const sections = sectionOrder
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (!visibleEntries.length) {
            return;
          }

          const activeSectionId = visibleEntries[0].target.id;
          if (sectionOrder.includes(activeSectionId)) {
            setActiveNav(nav, activeSectionId);
          }
        },
        {
          root: null,
          rootMargin: '-45% 0px -45% 0px',
          threshold: [0.2, 0.5, 0.75],
        },
      );

      sections.forEach((section) => observer.observe(section));
    }
  });
});
