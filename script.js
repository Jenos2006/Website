document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Menu items data
    const menuItems = [
        {
            id: 1,
            name: "Margherita",
            description: "Klassische Pizza mit Tomatensauce, Mozzarella und frischem Basilikum",
            price: 8.90,
            image: "pizza-margherita.jpg",
            category: "classic",
            toppings: ["Extra Käse", "Salami", "Schinken", "Pilze", "Oliven", "Artischocken"]
        },
        {
            id: 2,
            name: "Prosciutto",
            description: "Tomatensauce, Mozzarella und hochwertiger italienischer Schinken",
            price: 10.90,
            image: "pizza-prosciutto.jpg",
            category: "classic",
            toppings: ["Extra Käse", "Pilze", "Oliven", "Artischocken", "Rucola"]
        },
        {
            id: 3,
            name: "Diavola",
            description: "Scharfe Pizza mit Tomatensauce, Mozzarella, Salami und Peperoni",
            price: 11.50,
            image: "pizza-diavola.jpg",
            category: "special",
            toppings: ["Extra Käse", "Extra Peperoni", "Pilze", "Oliven", "Zwiebeln"]
        },
        {
            id: 4,
            name: "Quattro Formaggi",
            description: "Vier-Käse-Pizza mit Mozzarella, Gorgonzola, Parmesan und Pecorino",
            price: 12.50,
            image: "pizza-quattro-formaggi.jpg",
            category: "vegetarian",
            toppings: ["Extra Käse", "Pilze", "Oliven", "Truffelöl"]
        },
        {
            id: 5,
            name: "Vegetariana",
            description: "Vegetarische Pizza mit Tomatensauce, Mozzarella und frischem Gemüse",
            price: 11.90,
            image: "pizza-vegetariana.jpg",
            category: "vegetarian",
            toppings: ["Extra Käse", "Artischocken", "Oliven", "Rucola", "Sonnendursttomaten"]
        },
        {
            id: 6,
            name: "Truffel-Pizza",
            description: "Premium Pizza mit Trüffelcreme, Mozzarella, Pilzen und Trüffelöl",
            price: 15.90,
            image: "pizza-truffel.jpg",
            category: "special",
            toppings: ["Extra Trüffelöl", "Parmesan", "Rucola", "Prosciutto"]
        }
    ];
    
    // Toppings data
    const toppings = [
        "Extra Käse", "Salami", "Schinken", "Pilze", "Oliven", 
        "Artischocken", "Peperoni", "Zwiebeln", "Knoblauch", 
        "Rucola", "Sonnendursttomaten", "Parmesan", "Truffelöl"
    ];
    
    // Cart items
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Display menu items
    function displayMenuItems(category = 'all') {
        const menuContainer = document.querySelector('.menu-items');
        menuContainer.innerHTML = '';
        
        const filteredItems = category === 'all' 
            ? menuItems 
            : menuItems.filter(item => item.category === category);
        
        filteredItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.dataset.id = item.id;
            menuItem.dataset.category = item.category;
            
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="menu-item-img">
                <div class="menu-item-content">
                    <div class="menu-item-title">
                        <h3>${item.name}</h3>
                        <span class="price">€${item.price.toFixed(2)}</span>
                    </div>
                    <p>${item.description}</p>
                    <div class="menu-item-footer">
                        <span class="category-tag">${getCategoryName(item.category)}</span>
                        <button class="add-to-cart-btn" data-id="${item.id}">Bestellen</button>
                    </div>
                </div>
            `;
            
            menuContainer.appendChild(menuItem);
        });
        
        // Add event listeners to "Add to cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                openPizzaModal(itemId);
            });
        });
    }
    
    // Get category name
    function getCategoryName(category) {
        const categories = {
            'classic': 'Klassiker',
            'special': 'Spezial',
            'vegetarian': 'Vegetarisch'
        };
        return categories[category] || category;
    }
    
    // Category filter
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            displayMenuItems(category);
        });
    });
    
    // Open pizza modal
    function openPizzaModal(itemId) {
        const item = menuItems.find(i => i.id === itemId);
        if (!item) return;
        
        const modal = document.getElementById('pizzaModal');
        document.getElementById('modalPizzaName').textContent = item.name;
        document.getElementById('modalPizzaDescription').textContent = item.description;
        document.getElementById('modalPizzaImage').src = item.image;
        document.getElementById('modalPizzaImage').alt = item.name;
        
        // Set base prices for sizes
        document.querySelectorAll('.size-price[data-size="26"]').forEach(el => {
            el.textContent = item.price.toFixed(2);
        });
        document.querySelectorAll('.size-price[data-size="32"]').forEach(el => {
            el.textContent = (item.price + 3).toFixed(2);
        });
        document.querySelectorAll('.size-price[data-size="40"]').forEach(el => {
            el.textContent = (item.price + 6).toFixed(2);
        });
        
        // Set initial price display
        updateModalPrice();
        
        // Populate toppings
        const toppingsContainer = document.getElementById('toppingsContainer');
        toppingsContainer.innerHTML = '';
        
        toppings.forEach(topping => {
            const toppingItem = document.createElement('div');
            toppingItem.className = 'topping-item';
            
            toppingItem.innerHTML = `
                <input type="checkbox" id="topping-${topping}" value="${topping}">
                <label for="topping-${topping}">${topping}</label>
            `;
            
            toppingsContainer.appendChild(toppingItem);
        });
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Close modal
        document.querySelector('.close-modal').addEventListener('click', closeModal);
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Update price when size changes
        document.querySelectorAll('input[name="size"]').forEach(radio => {
            radio.addEventListener('change', updateModalPrice);
        });
        
        // Update price when quantity changes
        document.getElementById('quantity').addEventListener('change', updateModalPrice);
        
        // Add to cart button
        document.querySelector('.add-to-cart').addEventListener('click', function() {
            addToCart(item);
            closeModal();
        });
    }
    
    // Update modal price
    function updateModalPrice() {
        const selectedSize = document.querySelector('input[name="size"]:checked').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const basePrice = parseFloat(document.querySelector(`.size-price[data-size="${selectedSize}"]`).textContent);
        
        // Calculate toppings price
        let toppingsPrice = 0;
        const selectedToppings = document.querySelectorAll('#toppingsContainer input[type="checkbox"]:checked');
        toppingsPrice = selectedToppings.length * 0.8;
        
        const totalPrice = (basePrice + toppingsPrice) * quantity;
        document.getElementById('modalPizzaPrice').textContent = `€${totalPrice.toFixed(2)}`;
    }
    
    // Close modal
    function closeModal() {
        document.getElementById('pizzaModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Add to cart
    function addToCart(item) {
        const selectedSize = document.querySelector('input[name="size"]:checked').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        
        // Get selected toppings
        const selectedToppings = [];
        document.querySelectorAll('#toppingsContainer input[type="checkbox"]:checked').forEach(checkbox => {
            selectedToppings.push(checkbox.value);
        });
        
        // Calculate price
        let basePrice = item.price;
        if (selectedSize === '32') basePrice += 3;
        if (selectedSize === '40') basePrice += 6;
        const toppingsPrice = selectedToppings.length * 0.8;
        const totalPrice = (basePrice + toppingsPrice) * quantity;
        
        // Create cart item
        const cartItem = {
            id: Date.now(),
            pizzaId: item.id,
            name: item.name,
            size: selectedSize,
            toppings: selectedToppings,
            quantity: quantity,
            price: totalPrice,
            image: item.image
        };
        
        // Add to cart
        cart.push(cartItem);
        saveCart();
        updateCartUI();
        
        // Show notification
        showNotification(`${item.name} wurde zum Warenkorb hinzugefügt!`);
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Update cart UI
    function updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.total-price');
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Ihr Warenkorb ist leer</p>';
            cartTotal.textContent = '€0.00';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            total += item.price;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.id = item.id;
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">€${item.price.toFixed(2)}</span>
                    </div>
                    <p class="cart-item-size">Größe: ${item.size}cm</p>
                    ${item.toppings.length > 0 ? `<p class="cart-item-toppings">Extras: ${item.toppings.join(', ')}</p>` : ''}
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="decrease-quantity">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity">+</button>
                        </div>
                        <button class="remove-item">Entfernen</button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
            
            // Add event listeners for quantity changes
            cartItem.querySelector('.decrease-quantity').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    item.price = (item.price / (item.quantity + 1)) * item.quantity;
                    saveCart();
                    updateCartUI();
                }
            });
            
            cartItem.querySelector('.increase-quantity').addEventListener('click', () => {
                item.quantity++;
                item.price = (item.price / (item.quantity - 1)) * item.quantity;
                saveCart();
                updateCartUI();
            });
            
            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                cart = cart.filter(i => i.id !== item.id);
                saveCart();
                updateCartUI();
                showNotification(`${item.name} wurde entfernt`);
            });
        });
        
        cartTotal.textContent = `€${total.toFixed(2)}`;
    }
    
    // Cart sidebar toggle
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    
    cartIcon.addEventListener('click', function() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    cartOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        this.classList.remove('active');
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Ihr Warenkorb ist leer');
            return;
        }
        
        // In a real implementation, this would redirect to a checkout page
        alert('In einer echten Implementierung würden Sie jetzt zur Kasse weitergeleitet werden.');
    });
    
    // Initialize
    displayMenuItems();
    updateCartUI();
    
    // Add notification style
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 3000;
        }
        .notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
