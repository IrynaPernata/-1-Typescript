

import { initLoader } from './modules/loader';
import { initNavigation } from './modules/navigation';
import { initCarousel } from './modules/carousel';
import { initStatsCounter } from './modules/stats';
import { initSkillsGrid } from './modules/skills';
import { initParticleEffect } from './modules/particles';
import { initContactForm } from './modules/form';

/**
 * Головна точка входу.
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('PRISM FLUX Scripts Initializing...');
  
  // Запускаємо кожен імпортований модуль
  initLoader();
  initNavigation();
  initCarousel();   
  initStatsCounter(); 
  initSkillsGrid();   
  initParticleEffect(); 
  initContactForm(); 
});