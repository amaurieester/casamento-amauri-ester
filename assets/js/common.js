document.addEventListener('DOMContentLoaded', () => {
    // CONTROLE DO MENU LATERAL
    const menuToggle = document.getElementById('menuToggle');
    const menuLateral = document.getElementById('menuLateral');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');
    
    if (menuToggle && menuLateral && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            menuLateral.classList.add('active');
            menuOverlay.classList.add('active');
        });
    }

    if (menuClose && menuLateral && menuOverlay) {
        menuClose.addEventListener('click', () => {
            menuLateral.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    if (menuOverlay && menuLateral) {
        menuOverlay.addEventListener('click', () => {
            menuLateral.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.menu-lateral a').forEach(link => {
        link.addEventListener('click', () => {
            if(menuLateral) menuLateral.classList.remove('active');
            if(menuOverlay) menuOverlay.classList.remove('active');
        });
    });
});