
import type { SkillCategory } from '../types/index';
import { skillsData } from '../data/skills';  

/**
 * Генерація сітки навичок та налаштування фільтрів
 */
export function initSkillsGrid(): void {
  const grid: HTMLElement | null = document.getElementById('skillsGrid');
  const tabs: NodeListOf<HTMLElement> = document.querySelectorAll('.category-tab');
  if (!grid) return;


  try {
    const styleSheet = document.styleSheets[0];
    
    if (styleSheet) {
      let ruleExists = false;
      for (const rule of Array.from(styleSheet.cssRules)) {
        if (rule.type === CSSRule.KEYFRAMES_RULE && (rule as CSSKeyframesRule).name === 'fadeIn') {
          ruleExists = true;
          break;
        }
      }
      
      if (!ruleExists) {
        styleSheet.insertRule(`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `, styleSheet.cssRules.length);
      }
    } else {
      console.warn('Stylesheet not found, cannot insert fadeIn keyframes.');
    }
  } catch (error) {
    console.error('Failed to insert keyframe rule:', error);
  }
 
  const renderSkills = (filter: SkillCategory): void => {
    grid.innerHTML = ''; // Очистити сітку

    const filteredSkills = filter === 'all'
      ? skillsData
      : skillsData.filter(skill => skill.categories.includes(filter));

    if (filteredSkills.length === 0) {
      grid.innerHTML = '<p style="color: var(--text-secondary);">Немає навичок у цій категорії.</p>';
      return;
    }

    filteredSkills.forEach(skill => {
      const hex = document.createElement('div');
      hex.className = 'skill-hexagon';
      hex.style.animation = `fadeIn 0.5s ease forwards`; 
      hex.innerHTML = `
        <div class="hexagon-inner">
          <div class="hexagon-content">
            <div class="skill-icon-hex">${skill.icon}</div>
            <div class="skill-name-hex">${skill.name}</div>
            <div class="skill-level">
              <div class="skill-level-fill" style="width: ${skill.level}%"></div>
            </div>
            <div class="skill-percentage-hex">${skill.level}% Expertise</div>
          </div>
        </div>
      `;
      grid.appendChild(hex);
    });
  }; 

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const category: SkillCategory = tab.dataset.category as SkillCategory;
      renderSkills(category);
    });
  });
  
  renderSkills('all'); 
}