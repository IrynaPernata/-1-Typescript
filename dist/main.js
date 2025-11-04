"use strict";
// src/main.ts
Object.defineProperty(exports, "__esModule", { value: true });
// СТАТИЧНІ ДАНІ
const skillsData = [
    { name: 'TypeScript', icon: 'TS', level: 90, categories: ['frontend', 'backend'] },
    { name: 'React', icon: '⚛️', level: 95, categories: ['frontend'] },
    { name: 'Node.js', icon: '📦', level: 85, categories: ['backend'] },
    { name: 'Docker', icon: '🐳', level: 75, categories: ['cloud'] },
    { name: 'AWS', icon: '☁️', level: 70, categories: ['cloud'] },
    { name: 'Python', icon: '🐍', level: 80, categories: ['backend'] },
    { name: 'WebAssembly', icon: 'Wasm', level: 60, categories: ['emerging'] },
    { name: 'GraphQL', icon: '📊', level: 70, categories: ['frontend', 'backend'] },
    { name: 'Kubernetes', icon: '☸️', level: 65, categories: ['cloud'] },
    { name: 'Svelte', icon: '🔥', level: 75, categories: ['frontend'] },
    { name: 'Rust', icon: '🦀', level: 50, categories: ['backend', 'emerging'] },
    { name: 'Next.js', icon: '🚀', level: 90, categories: ['frontend'] },
];
// ЗАПУСК ПІСЛЯ ЗАВАНТАЖЕННЯ СТОРІНКИ
/**
 * Запускаємо всі ініціалізуючі функції, коли DOM готовий
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('PRISM FLUX Scripts Initializing...');
    initLoader();
    initNavigation();
    initCarousel(); // Включає 'fetch'
    initStatsCounter(); // Анімація лічильників
    initSkillsGrid(); // Генерація та фільтрація
    initParticleEffect(); // Анімація
    initContactForm(); // 'submit' listener
});
// ФУНКЦІЇ ІНІЦІАЛІЗАЦІЇ
/**
 *  Ховає екран завантаження, коли сторінка повністю завантажена
 */
function initLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.classList.add('hidden');
        });
    }
}
/**
 *  Налаштовує всю навігацію:
 
 */
function initNavigation() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    //Зміна хедера
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        }
        else {
            header?.classList.remove('scrolled');
        }
        // Активне посилання
        let currentSection = '';
        const headerHeight = header?.clientHeight || 85;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
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
    // Мобільне меню
    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu?.classList.toggle('active');
    });
    // Закриття меню
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
}
/**
 *fetch даних та налаштування 3D-каруселі
 */
async function initCarousel() {
    const carousel = document.getElementById('carousel');
    const indicatorsContainer = document.getElementById('indicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (!carousel || !indicatorsContainer || !prevBtn || !nextBtn)
        return;
    let posts = [];
    try {
        // Виконуємо fetch запит
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=7');
        if (!response.ok)
            throw new Error(`Network response was not ok: ${response.statusText}`);
        posts = await response.json();
    }
    catch (error) {
        console.error('Failed to fetch carousel posts:', error);
        carousel.innerHTML = '<p style="color: var(--text-secondary);">Не вдалося завантажити проєкти.</p>';
        return;
    }
    let currentAngle = 0;
    const numItems = posts.length;
    const theta = 360 / numItems;
    //  Генерація елементів каруселі та індикаторів
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
        if (index === 0)
            indicator.classList.add('active');
        indicatorsContainer.appendChild(indicator);
    });
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const itemWidth = items[0]?.offsetWidth || 400;
    // Радіус каруселі
    const radius = (itemWidth / 2) / Math.tan(Math.PI / numItems);
    // Функція оновлення 3D-позицій
    const updateCarousel = () => {
        carousel.style.transform = `rotateY(${currentAngle}deg)`;
        items.forEach((item, index) => {
            const itemAngle = theta * index;
            item.style.transform = `rotateY(${itemAngle}deg) translateZ(${radius}px)`;
        });
        const activeIndex = (Math.round(-currentAngle / theta) + numItems) % numItems;
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === activeIndex);
        });
    };
    // Listeners для кнопок
    nextBtn.addEventListener('click', () => {
        currentAngle -= theta;
        updateCarousel();
    });
    prevBtn.addEventListener('click', () => {
        currentAngle += theta;
        updateCarousel();
    });
    //  Listeners для індикаторів
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const index = parseInt(indicator.dataset.index || '0', 10);
            const activeIndex = (Math.round(-currentAngle / theta) + numItems) % numItems;
            const angleDiff = index - activeIndex;
            currentAngle -= angleDiff * theta;
            updateCarousel();
        });
    });
    updateCarousel();
}
/**
 *Анімація лічильників у секції 'stats' при прокрутці
 */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    // Плавна анімація числа
    const animateValue = (el, start, end, duration) => {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime)
                startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            el.textContent = Math.floor(progress * (end - start) + start).toString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    // Використовуємо IntersectionObserver для запуску анімації, коли секція видима
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(numEl => {
                    const target = parseInt(numEl.dataset.target || '0', 10);
                    animateValue(numEl, 0, target, 2000); // Анімація триває 2 секунди
                });
                observer.unobserve(entry.target); // Запустити анімацію лише один раз
            }
        });
    }, { threshold: 0.5 }); // Запуск, коли 50% елемента видно
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}
/**
 * Генерація сітки навичок та налаштування 'click' фільтрів
 */
function initSkillsGrid() {
    const grid = document.getElementById('skillsGrid');
    const tabs = document.querySelectorAll('.category-tab');
    if (!grid)
        return;
    try {
        const styleSheet = document.styleSheets[0];
        if (styleSheet) {
            let ruleExists = false;
            for (const rule of Array.from(styleSheet.cssRules)) {
                if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'fadeIn') {
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
        }
        else {
            console.warn('Stylesheet not found, cannot insert fadeIn keyframes.');
        }
    }
    catch (error) {
        console.error('Failed to insert keyframe rule:', error);
    }
    //  Функція для рендеру навичок 
    const renderSkills = (filter) => {
        grid.innerHTML = ''; // Очистити сітку
        // Фільтруємо дані
        const filteredSkills = filter === 'all'
            ? skillsData
            : skillsData.filter(skill => skill.categories.includes(filter));
        if (filteredSkills.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-secondary);">Немає навичок у цій категорії.</p>';
            return;
        }
        // Створюємо HTML для кожної навички
        filteredSkills.forEach(skill => {
            const hex = document.createElement('div');
            hex.className = 'skill-hexagon';
            // Додаємо анімацію появи 
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
    // Listeners для табів
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.dataset.category;
            renderSkills(category);
        });
    });
    renderSkills('all');
}
/**
 *  Генерація анімованих частинок у секції 'about'
 */
function initParticleEffect() {
    const container = document.getElementById('particles');
    if (!container)
        return;
    const numParticles = 30;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        // Початкова позиція 
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 50 + 100}%`;
        // Рандомізуємо анімацію з CSS
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 15;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`;
        container.appendChild(particle);
    }
}
/**
 * listener для контактної форми
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form)
        return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Отримуємо дані
        const formData = new FormData(form);
        const name = formData.get('name') || 'User';
        console.log('Form submission intercepted:');
        console.log('Name:', name);
        console.log('Email:', formData.get('email'));
        console.log('Subject:', formData.get('subject'));
        console.log('Message:', formData.get('message'));
        // Імітуємо успішну відправку
        alert(`Дякуємо, ${name}! Ваше повідомлення (імітація) було надіслано.`);
        form.reset();
    });
}
//# sourceMappingURL=main.js.map