<script>
         function toggleTheme() {
            document.body.classList.toggle('dark-theme');
            updateButtonBoxesTheme();
            updateCategoryButtonsTheme(); // Adicionado para atualizar os botões de categoria
        }
        function updateCategoryButtonsTheme() {
            const isDarkTheme = document.body.classList.contains('dark-theme');
            const categoryButtons = document.querySelectorAll('nav a');
            categoryButtons.forEach(button => {
                if (isDarkTheme) {
                    button.style.backgroundColor = 'var(--button-text-color-light)'; // Cor tema escuro
                    button.style.color = 'var(--button-text-color-light)';
                } else {
                    button.style.backgroundColor = 'var(--button-color-light2)'; // Cor tema claro
                    button.style.color = 'var(--button-text-color-light)';
                }
            });
        }




        function filterProducts(query) {
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
    renderCategorizedProducts(filteredProducts); // Usar renderCategorizedProducts para manter categorias
}

        const products = JSON.parse(localStorage.getItem('products')) || [];

        const grid = document.getElementById('product-grid');
        let currentCarouselIndex = 0; // Índice para controlar o carrossel de imagens
        let currentPopupProductId = null; // Para rastrear o produto do popup atual

      function renderProducts(productsToRender) {
    grid.innerHTML = '';
    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openPopup(${product.id})" loading="lazy">
            <h3>${product.name}</h3>
            <p class="product-price">${formatPrice(product.price)}</p>
            <button class="add-to-cart-popup" onclick="addToCart(${product.id})">Quero Este Produto</button>
        `;
        grid.appendChild(card);
    });
}

        function renderCategorizedProducts(productsToRender) {
            grid.innerHTML = ''; // Limpa o grid antes de renderizar

            const categories = [...new Set(productsToRender.map(product => product.category))]; // Obtém categorias únicas

            categories.forEach(category => {
                const categorySection = document.createElement('div');
                categorySection.className = 'category-section';

                const categoryTitle = document.createElement('h2');
                categoryTitle.className = 'category-title';
                categoryTitle.textContent = category;
                categorySection.appendChild(categoryTitle);

                const categoryProductsGrid = document.createElement('div');
                categoryProductsGrid.className = 'category-products';

                const productsInCategory = productsToRender.filter(product => product.category === category);
                productsInCategory.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                                                            <img src="${product.images[0]}" alt="${product.name}" onclick="openPopup(${product.id})" loading="lazy">
                                                            <h3>${product.name}</h3>
                                                            <p class="product-price">${formatPrice(product.price)}</p>  <button class="add-to-cart-popup" onclick="addToCart(${product.id})">Quero Este Produto</button>
                        `;
                    categoryProductsGrid.appendChild(card);
                });
                categorySection.appendChild(categoryProductsGrid);
                grid.appendChild(categorySection); // Adiciona a seção de categoria ao grid principal
            });
        }
        function filterCategory(category) {
    const categoryLinks = document.querySelectorAll('nav a');
    categoryLinks.forEach(link => link.classList.remove('active')); // Remove 'active' de todos
    document.querySelector(`nav a[data-category="${category}"]`).classList.add('active'); // Adiciona 'active' ao clicado

    let filteredProducts;
    if (category === 'Todos') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    renderCategorizedProducts(filteredProducts); // Renderiza produtos filtrados E categorizados
}


        document.getElementById('search-bar').addEventListener('input', (e) => {
            filterProducts(e.target.value);
        });
        filterCategory('Todos'); // Renderização inicial de todos os produtos categorizados


        function openPopup(productId) {
    currentPopupProductId = productId;
    const product = products.find(p => p.id === productId);
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
    document.body.classList.add('popup-open');

    // Carrossel de Imagens (mantém como está) ...
    const carouselHTML = `
        <div class="image-carousel">
            <div class="carousel-images" id="carouselImages-${productId}">
                ${product.images.map(image => `<img src="${image}" alt="${product.name}">`).join('')}
            </div>
            ${product.images.length > 1 ? `<button class="carousel-arrow prev" onclick="prevImage(${productId})">&#10094;</button>
            <button class="carousel-arrow next" onclick="nextImage(${productId})">&#10095;</button>` : ''}
        </div>
    `;

    document.getElementById('popup-content').innerHTML = `
        ${carouselHTML}
        <h2>${product.name}</h2>
        <p>${product.topDescription}</p>  <button class="add-to-cart-popup" onclick="addToCart(${product.id})">Quero Este Produto</button>
    `;
    currentCarouselIndex = 0;
    updateCarousel(productId);
}

        function prevImage(productId) {
            currentCarouselIndex = Math.max(0, currentCarouselIndex - 1);
            updateCarousel(productId);
        }

        function nextImage(productId) {
            const product = products.find(p => p.id === productId);
            currentCarouselIndex = Math.min(product.images.length - 1, currentCarouselIndex + 1);
            updateCarousel(productId);
        }

        function updateCarousel(productId) {
            const carouselImagesElement = document.getElementById(`carouselImages-${productId}`);
            if (carouselImagesElement) {
                carouselImagesElement.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
            }
        }


        function closePopup() {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('popup').style.display = 'none';
            document.body.classList.remove('popup-open');
        }

       function addToCart(productId) {
    console.log("Função addToCart foi chamada para o produto ID:", productId);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    // Show the message
    const messageDiv = document.getElementById('product-added-message');
    messageDiv.style.display = 'block';
    // Hide the message after a delay (e.g., 2 seconds)
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 2000); // 2000 milliseconds = 2 seconds
}


        function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    let totalCartValue = 0; // Variável para armazenar o total do carrinho

    if (cart.length === 0) {
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.textContent = 'Seu carrinho está vazio.';
        emptyCartMessage.classList.add('empty-cart-message');
        cartItemsContainer.appendChild(emptyCartMessage);
    } else {
        const observationArea = document.createElement('div');
        observationArea.innerHTML = `

        `;
        // REMOVIDO A CAIXA DE OBSERVAÇÃO DO CARRINHO! - **CAIXA DE OBSERVAÇÃO REMOVIDA**
        // cartItemsContainer.appendChild(observationArea);

        cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity; // Calcula o subtotal do item
            totalCartValue += itemSubtotal; // Adiciona ao total geral

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.images[0]}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <div class="quantity-controls">
                        <button class="quantity-button"
                            onclick="decreaseQuantity(${item.id})"
                            onmousedown="startDecreaseQuantity(${item.id})"
                            onmouseup="stopDecreaseQuantity()"
                            onmouseleave="stopDecreaseQuantity()">
                            -
                        </button>
                        <input type="number" class="item-quantity-input" value="${item.quantity}" min="1"
                            onchange="updateQuantityInput(this, ${item.id})">
                        <button class="quantity-button"
                            onclick="increaseQuantity(${item.id})"
                            onmousedown="startIncreaseQuantity(${item.id})"
                            onmouseup="stopIncreaseQuantity()"
                            onmouseleave="stopDecreaseQuantity()">
                            +
                        </button>
                    </div>
                    <p class="item-price">Subtotal: ${formatPrice(itemSubtotal)}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remover item">
                    <i class="fas fa-trash-alt"></i> <span style="font-size: 1px; opacity: 0;">Remover</span>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    function updateSendButtonLink(totalValue) {
        const sendButton = document.querySelector('.popup-cart .cart-footer button:last-child'); // Seleciona o botão "Enviar no WhatsApp"
        sendButton.textContent = 'Limpar tudo'; // Remove a parte do total
    }

    const cartFooter = document.querySelector('.popup-cart .cart-footer');
    let totalDisplay = cartFooter.querySelector('#cart-total-display');
    if (!totalDisplay) {
        totalDisplay = document.createElement('div');
        totalDisplay.id = 'cart-total-display';
        cartFooter.insertBefore(totalDisplay, cartFooter.firstChild); // Insere antes dos botões
    }
    totalDisplay.innerHTML = `Total: ${formatPrice(totalCartValue)}`; // Atualiza o valor total

    updateSendButtonLink(totalCartValue); // Atualiza o link do botão "Enviar no WhatsApp" com o total
}

        function updateQuantity(productId, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = parseInt(quantity);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

        function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const itemElementToRemove = cartItemsContainer.querySelector(`.cart-item:has(button[onclick*='removeFromCart(${productId})'])`);
    if (itemElementToRemove) {
        itemElementToRemove.classList.add('removing-item');
        setTimeout(() => {
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }, 300);
    } else {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

        function clearCart() {
    localStorage.removeItem('cart');
    renderCart();
}

       function openDoubtPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('doubtPopup').style.display = 'block';
}

        function closeDoubtPopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('doubtPopup').style.display = 'none';
}

        function sendToWhatsappDoubt() { // Função renomeada para diferenciar
    const doubtText = document.getElementById('doubtText').value;
    let whatsappMessage = "*Dúvida do Cliente:*\n" + (doubtText ? doubtText : "Sem dúvida digitada") + "\n\n";

    // Envia direto para o WhatsApp após confirmar a dúvida
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = '+5579991996384';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

    closeDoubtPopup(); // Fecha o popup de dúvidas após enviar
}

        function sendToWhatsappCart() { // Nova função para enviar o carrinho pelo botão no carrinho
    openCustomerNamePopup(""); // Abre o popup de nome SEM mensagem inicial, pois já está enviando o carrinho
    toggleCart(); // Fecha o carrinho
}


function openCustomerNamePopup(initialMessage) {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('customerNamePopup').style.display = 'block';
    document.getElementById('customerNameInput').value = ''; // Limpa o campo de nome a cada vez que abre
    document.getElementById('customerObservation').value = ''; // Limpa o campo de observação também
    customerInitialMessage = initialMessage; // Armazena a mensagem inicial
}


let customerInitialMessage = ""; // Variável global para armazenar a mensagem inicial

function confirmSendToWhatsapp() {
    const customerName = document.getElementById('customerNameInput').value;
    if (customerName.trim() === '') {
        alert('Por favor, insira o nome do cliente.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('O carrinho está vazio. Adicione produtos antes de enviar.');
        closeCustomerNamePopup();
        return;
    }

    const observation = document.getElementById('customerObservation').value || 'Sem observação';
    let productListText = '';
    cart.forEach(item => {
        productListText += `⦿ ${item.quantity} ${item.name}\n\n`;
    });

    const totalCartValue = cart.reduce((total, item) => total + (item.price * item.quantity), 0); // Recalcula o total

    // Monta a mensagem completa, incluindo a mensagem inicial (dúvida) e os dados do pedido
    let whatsappMessage = customerInitialMessage + `✤ RESUMO DO PEDIDO ✤\n\n*PRODUTOS*\n\n${productListText}\n*CLIENTE:*\n${customerName}\n\n*OBSERVAÇÃO:*\n${observation}\n\n*＄TOTAL*: ${formatPrice(totalCartValue)}`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = '+5579991996384';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

    closeCustomerNamePopup();
}


function closeCustomerNamePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('customerNamePopup').style.display = 'none';
}
function formatPrice(price) {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

        function toggleCart() {
    document.getElementById('popup-cart').classList.toggle('open');
}

        function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

        function renderProducts(productsToRender) {
    grid.innerHTML = '';
    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openPopup(${product.id})" loading="lazy">
            <h3>${product.name}</h3>
            <p class="product-price">${formatPrice(product.price)}</p>
            <button class="add-to-cart-popup" onclick="addToCart(${product.id})">Quero Este Produto</button>
        `;
        grid.appendChild(card);
    });
}

        function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
    document.getElementById('sidebar').classList.remove('dark-theme', 'light-theme');
    document.getElementById('sidebar').classList.add(currentTheme);
    updateButtonBoxesTheme(); // Garante que as bordas dos botões são atualizadas também ao trocar o tema
}
        renderCart();
        let increaseInterval;
        let decreaseInterval;
        function startIncreaseQuantity(productId) {
            increaseInterval = setInterval(() => {
                increaseQuantity(productId);
            }, 100);
        }

        function stopIncreaseQuantity() {
            clearInterval(increaseInterval);
        }

        function startDecreaseQuantity(productId) {
            decreaseInterval = setInterval(() => {
                decreaseQuantity(productId);
            }, 100);
        }

        function stopDecreaseQuantity() {
            clearInterval(decreaseInterval);
        }

        function updateQuantityInput(inputElement, productId) {
    let quantity = parseInt(inputElement.value);
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        inputElement.value = quantity;
    }
    updateQuantity(productId, quantity);
}

        function increaseQuantity(productId) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity++;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }

        function decreaseQuantity(productId) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                if (cartItem.quantity > 1) {
                    cartItem.quantity--;
                } else {
                    removeFromCart(productId);
                    return;
                }
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
}

        // Chamada inicial para definir as bordas dos botões com base no tema inicial
        updateButtonBoxesTheme();
        updateCategoryButtonsTheme(); // Chamada inicial para tema dos botões de categoria

async function loadProducts() {
    try {
        // URL do Pastebin com o JSON dos produtos
        const pastebinUrl = 'https://https://pastebin.com/raw/fmAw7uL7';
        
        // Carrega os produtos do Pastebin
        const response = await fetch(pastebinUrl);
        const products = await response.json();

        // Salva os produtos no localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Renderiza os produtos na página
        renderProducts(products);
    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
    }
}

// Chama a função para carregar os produtos ao carregar a página
loadProducts();

// Chama a função para carregar os produtos ao carregar a página
loadProducts();
    </script>