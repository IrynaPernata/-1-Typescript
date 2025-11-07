

/**
 * Ховає екран завантаження, коли сторінка повністю завантажена
 */
export function initLoader(): void {
  const loader: HTMLElement | null = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.classList.add('hidden');
    });
  }
}