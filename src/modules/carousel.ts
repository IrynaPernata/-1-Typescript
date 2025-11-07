

import type { Post } from '../types/index';


export async function initCarousel(): Promise<void> {
  const carousel: HTMLElement | null = document.getElementById('carousel');
  const indicatorsContainer: HTMLElement | null = document.getElementById('indicators');
  const prevBtn: HTMLElement | null = document.getElementById('prevBtn');
  const nextBtn: HTMLElement | null = document.getElementById('nextBtn');

  if (!carousel || !indicatorsContainer || !prevBtn || !nextBtn) return;

  let posts: Post[] = [];
  try {

    const response: Response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=7'); 
    if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
    posts = await response.json();
  } catch (error) {
    console.error('Failed to fetch carousel posts:', error);
    carousel.innerHTML = '<p style="color: var(--text-secondary);">Не вдалося завантажити проєкти.</p>';
    return;
  }

  let currentAngle: number = 0;
  const numItems: number = posts.length;
  const theta: number = 360 / numItems; 


  posts.forEach((post, index) => {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.innerHTML = `
      <div class="card">
        <div class="card-number">0${index + 1}</div>
        <div class="card-image">
          <img src="https://picsum.photos/400/200?random=${post.id}" alt="Project Image ${post.id}">
        </div>
        <h3 class="card-title">${post.title.substring(0, 20)}...</h3>
        <p class="card-description">${post.body.substring(0, 70)}...</p>
        <div class="card-tech">
          <span class="tech-badge">API</span>
          <span class="tech-badge">Fetch</span>
          <span class="tech-badge">TS</span>
        </div>
        <button class="card-cta">Детальніше</button>
      </div>
    `;
    carousel.appendChild(item);

    const indicator = document.createElement('div');
    indicator.className = 'indicator';
    indicator.dataset.index = index.toString();
    if (index === 0) indicator.classList.add('active');
    indicatorsContainer.appendChild(indicator);
  });

  const items: NodeListOf<HTMLElement> = document.querySelectorAll('.carousel-item');
  const indicators: NodeListOf<HTMLElement> = document.querySelectorAll('.indicator');
  const itemWidth: number = items[0]?.offsetWidth || 400;
  

  const radius: number = (itemWidth / 2) / Math.tan(Math.PI / numItems);


  const updateCarousel = (): void => {
    carousel.style.transform = `rotateY(${currentAngle}deg)`;

    items.forEach((item, index) => {
      const itemAngle: number = theta * index;
      item.style.transform = `rotateY(${itemAngle}deg) translateZ(${radius}px)`;
    });

    const activeIndex: number = (Math.round(-currentAngle / theta) + numItems) % numItems;
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === activeIndex);
    });
  };

 
  nextBtn.addEventListener('click', () => {
    currentAngle -= theta;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentAngle += theta;
    updateCarousel();
  });


  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const index: number = parseInt(indicator.dataset.index || '0', 10);
      const activeIndex: number = (Math.round(-currentAngle / theta) + numItems) % numItems;
      const angleDiff: number = index - activeIndex;
      currentAngle -= angleDiff * theta;
      updateCarousel();
    });
  });

  updateCarousel();
}