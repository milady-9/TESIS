// ===================================================================
// LÓGICA DE NAVEGACIÓN Y ENCABEZADO
// ===================================================================

const navMenu = document.querySelector('.nav-menu');
const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('.nav-menu li a');

// 1. Alternar el menú al hacer clic en el botón (Hamburguesa)
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active'); // Clase para animar el icono (la 'X')
});

// 2. Cerrar el menú después de hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Solo si el menú está abierto
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// 3. Efecto de encabezado al hacer scroll (Fondo opaco)
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


// ===================================================================
// LÓGICA DEL LIGHTBOX (Ventana Modal de Fotos)
// ===================================================================

const modal = document.getElementById('lightbox-modal');
const modalImg = document.getElementById('lightbox-image');
const modalCaption = document.getElementById('lightbox-caption');

// Función para abrir la imagen
window.openLightbox = function(src, caption) {
    modal.style.display = 'flex'; // Usamos flex para centrar
    modalImg.src = src;
    modalCaption.innerHTML = caption;
    document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
    modal.classList.add('active'); 
}

// Función para cerrar la imagen
window.closeLightbox = function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Habilita el scroll del fondo
    modal.classList.remove('active'); 
}

// Cerrar al hacer clic en el fondo de la modal
modal.addEventListener('click', function(e) {
    // Si el clic fue directamente en el modal o en el botón de cierre 'x'
    // La clase 'lightbox-close' se encuentra dentro de 'modal'
    if (e.target === modal || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
    }
});

// Cerrar al presionar la tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeLightbox();
    }
});// ===================================================================
// LÓGICA DEL FORMULARIO DE CONTACTO (Mensaje de Éxito)
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    if (contactForm && formMessage && submitButton) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Detiene el envío real del formulario (evita la recarga de página)

            // 1. Ocultar el formulario y el botón
            contactForm.style.opacity = '0';
            contactForm.style.height = '0';
            contactForm.style.overflow = 'hidden';
            
            // 2. Mostrar el mensaje de éxito
            formMessage.innerHTML = '¡Mensaje enviado con éxito! Nos contactaremos contigo lo más pronto posible. ¡Gracias por tu interés!';
            formMessage.classList.add('show-message');

            // OPCIONAL: Reaparecer el formulario después de 5 segundos
            setTimeout(() => {
                formMessage.classList.remove('show-message');
                formMessage.style.opacity = '0'; // Aseguramos que desaparece suavemente
                
                // Restablecer el formulario y hacerlo visible
                contactForm.reset(); 
                contactForm.style.opacity = '1';
                contactForm.style.height = 'auto'; // Vuelve a su altura normal
                contactForm.style.overflow = 'visible';
                
            }, 5000); // 5 segundos
        });
    }
});