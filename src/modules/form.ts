


export function initContactForm(): void {
  const form: HTMLFormElement | null = document.getElementById('contactForm') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e: Event) => {
    e.preventDefault(); 

    // Отримуємо дані
    const formData = new FormData(form);
    const name: string = (formData.get('name') as string) || 'User';
    
    console.log('Form submission intercepted:');
    console.log('Name:', name);
    console.log('Email:', formData.get('email') as string);
    console.log('Subject:', formData.get('subject') as string);
    console.log('Message:', formData.get('message') as string);

    // Імітуємо успішну відправку
    alert(`Дякуємо, ${name}! Ваше повідомлення (імітація) було надіслано.`);
    form.reset();
  });
}