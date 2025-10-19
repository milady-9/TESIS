/* ... [TODO TU CÓDIGO JS ANTERIOR AQUÍ] ... */

// -------------------------------------------------------------------
// NUEVA LÓGICA DEL LIGHTBOX (Ventana Modal de Fotos)
// -------------------------------------------------------------------

const modal = document.getElementById('lightbox-modal');
const modalImg = document.getElementById('lightbox-image');
const modalCaption = document.getElementById('lightbox-caption');

// Función para abrir la imagen
function openLightbox(src, caption) {
    modal.style.display = 'block';
    modalImg.src = src;
    modalCaption.innerHTML = caption;
    document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
}

// Función para cerrar la imagen
function closeLightbox() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Habilita el scroll del fondo
}

// Cerrar al presionar la tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeLightbox();
    }
});