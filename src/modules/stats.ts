
/**
 * Анімація лічильників при прокрутці
 */
export function initStatsCounter(): void {
  const statNumbers: NodeListOf<HTMLElement> = document.querySelectorAll('.stat-number');


  const animateValue = (el: HTMLElement, start: number, end: number, duration: number): void => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress: number = Math.min((timestamp - startTime) / duration, 1);
      el.textContent = Math.floor(progress * (end - start) + start).toString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(numEl => {
          const target: number = parseInt(numEl.dataset.target || '0', 10);
          animateValue(numEl, 0, target, 2000); 
        });
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.5 }); 

  const statsSection: HTMLElement | null = document.getElementById('stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}