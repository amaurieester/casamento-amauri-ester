menuClose.addEventListener('click', () => {
            menuLateral.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
        
        menuOverlay.addEventListener('click', () => {
            menuLateral.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('.menu-lateral a').forEach(link => {
            link.addEventListener('click', () => {
                menuLateral.classList.remove('active');
                menuOverlay.classList.remove('active');
            });
        });