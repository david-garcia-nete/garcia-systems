document.addEventListener('DOMContentLoaded', () => {
  const desktopQuery = window.matchMedia('(min-width: 760px)');

  document.querySelectorAll('.nav-bar').forEach((navBar) => {
    const menuButton = navBar.querySelector('.menu-toggle');
    const nav = navBar.querySelector('.nav');

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
