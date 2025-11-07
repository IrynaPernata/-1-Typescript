


export function initNavigation(): void {
  const header: HTMLElement | null = document.getElementById('header');
  const menuToggle: HTMLElement | null = document.getElementById('menuToggle');
  const navMenu: HTMLElement | null = document.getElementById('navMenu');
  const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.nav-link');
  const sections: NodeListOf<HTMLElement> = document.querySelectorAll('section');


  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    let currentSection: string = '';
    const headerHeight: number = header?.clientHeight || 85;

    sections.forEach(section => {
      const sectionTop: number = section.offsetTop - headerHeight;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });


  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu?.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
    });
  });
}