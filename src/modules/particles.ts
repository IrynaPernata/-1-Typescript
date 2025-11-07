
/**
 * Генерація анімованих частинок у секції 'about'
 */
export function initParticleEffect(): void {
  const container: HTMLElement | null = document.getElementById('particles');
  if (!container) return;

  const numParticles: number = 30;

  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size: number = Math.random() * 3 + 1; 
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 50 + 100}%`; 
    
    const duration: number = Math.random() * 10 + 15; 
    const delay: number = Math.random() * 15; 
    
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `-${delay}s`; 
    
    container.appendChild(particle);
  }
}