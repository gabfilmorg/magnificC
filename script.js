// Sistema simples e direto para carregar imagens
const categories = {
    'mesa-posta': {
        folder: 'MESA POSTA', // Pasta na raiz do GitHub Pages
        images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png']
    }
};

let currentCategory = 'home';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎄 Magnific Decor iniciado!');
    setupNavigation();
    setupHomeCards();
});

// Configurar navegação
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            navigateToCategory(category);
        });
    });
}

// Configurar cards da home
function setupHomeCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            navigateToCategory(category);
        });
    });
}

// Navegar para categoria
function navigateToCategory(category) {
    console.log(`🎯 Navegando para: ${category}`);
    currentCategory = category;
    updateActiveNavigation(category);
    showSection(category);
    
    if (category !== 'home') {
        loadCategoryImages(category);
    }
}

// Atualizar navegação ativa
function updateActiveNavigation(activeCategory) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        const category = button.getAttribute('data-category');
        if (category === activeCategory) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Mostrar seção
function showSection(category) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(category);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

// Carregar imagens da categoria
function loadCategoryImages(category) {
    const categoryData = categories[category];
    if (!categoryData) {
        console.log(`❌ Categoria não encontrada: ${category}`);
        return;
    }
    
    const gallery = document.getElementById(`${category}-gallery`);
    if (!gallery) {
        console.log(`❌ Gallery não encontrada: ${category}-gallery`);
        return;
    }
    
    gallery.innerHTML = '';
    
    if (categoryData.images.length === 0) {
        showEmptyState(gallery, category);
        return;
    }
    
    // Carregar imagens com caminho adaptativo
    categoryData.images.forEach((imageName, index) => {
        // Detectar se estamos no GitHub Pages ou local
        const isGitHubPages = window.location.hostname === 'gabfilmorg.github.io';
        const imagePath = isGitHubPages ? 
            `${categoryData.folder}/${imageName}` : // GitHub Pages: MESA POSTA/1.png
            `imagens/${categoryData.folder}/${imageName}`; // Local: imagens/MESA POSTA/1.png
        
        createImageItem(gallery, imagePath, index + 1);
    });
    
    console.log(`✅ ${categoryData.images.length} imagens carregadas para ${category}`);
}

// Criar item de imagem
function createImageItem(gallery, imagePath, number) {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    
    const img = document.createElement('img');
    img.alt = `Imagem ${number}`;
    img.loading = 'lazy';
    
    // Debug detalhado
    console.log(`🔍 Tentando carregar imagem ${number}:`);
    console.log(`📍 Caminho: ${imagePath}`);
    console.log(`📍 URL completa: ${window.location.origin}/${imagePath}`);
    console.log(`📍 Hostname: ${window.location.hostname}`);
    
    // Tentar diferentes caminhos
    const possiblePaths = [
        imagePath,
        `./${imagePath}`,
        `/${imagePath}`,
        imagePath.replace(/\s+/g, '%20'),
        `./${imagePath.replace(/\s+/g, '%20')}`
    ];
    
    let currentPathIndex = 0;
    
    function tryNextPath() {
        if (currentPathIndex < possiblePaths.length) {
            const currentPath = possiblePaths[currentPathIndex];
            console.log(`🔄 Tentativa ${currentPathIndex + 1}: ${currentPath}`);
            img.src = currentPath;
            currentPathIndex++;
        } else {
            console.log(`❌ Todas as tentativas falharam para imagem ${number}`);
            // Mostrar erro visual
            imageItem.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #751102;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Erro ao carregar imagem ${number}</h3>
                    <p>Caminhos testados:</p>
                    <ul style="text-align: left; font-size: 0.8em;">
                        ${possiblePaths.map(path => `<li>${path}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // Tratar erro de carregamento
    img.onerror = function() {
        console.log(`❌ Erro ao carregar: ${img.src}`);
        tryNextPath();
    };
    
    // Tratar sucesso no carregamento
    img.onload = function() {
        console.log(`✅ Imagem carregada com sucesso: ${img.src}`);
    };
    
    // Tentar o primeiro caminho
    tryNextPath();
    
    imageItem.appendChild(img);
    gallery.appendChild(imageItem);
}

// Mostrar estado vazio
function showEmptyState(gallery, category) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <i class="fas fa-image"></i>
        <h3>Em breve...</h3>
        <p>Novos produtos da categoria ${category} serão adicionados em breve!</p>
    `;
    gallery.appendChild(emptyState);
}
