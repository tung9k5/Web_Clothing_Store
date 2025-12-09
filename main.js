const DB_KEYS = { PRODUCTS: "moda_products", USERS: "moda_users", ORDERS: "moda_orders", LEDGER: "moda_revenue_ledger", CURRENT_USER: "moda_current_user" };

function formatCurrency(amount) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount); }
function safeRedirect(url) { if (window.location.protocol === 'blob:') { alert("Preview: Redirect to " + url); return; } window.location.href = url; }

// --- VALIDATOR UTILS ---
const Validator = {
    isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isPhone: (phone) => /^\d{10,12}$/.test(phone),
    isLength: (str, min) => str.trim().length >= min
};

// --- SEEDING DATA (Updated 30 items + Complex Orders) ---
function initDynamicData() {
    // 1. Dữ liệu Sản phẩm (30 items) - Ảnh Unsplash chuẩn
    const products = [
        // MEN (15 items)
        { id: 101, name: "White Oxford Shirt", category: "men", price: 35, quantity: 50, img: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500", desc: "Classic white oxford shirt." },
        { id: 102, name: "Black Slim Trousers", category: "men", price: 45, quantity: 30, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500", desc: "Elegant slim fit trousers." },
        { id: 103, name: "Blue Basic Polo", category: "men", price: 25, quantity: 100, img: "https://images.unsplash.com/photo-1626307416562-ee839676f5fc?w=500", desc: "100% cotton polo." },
        { id: 104, name: "Ripped Jeans", category: "men", price: 55, quantity: 20, img: "https://mediahub.boohoo.com/bmm52961_ice%20blue_xl/male-ice%20blue-skinny-stretch-bleached-ripped-knee-jeans/?w=900&fmt=auto&sm=C", desc: "Street style jeans." },
        { id: 105, name: "Khaki Bomber", category: "men", price: 65, quantity: 15, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500", desc: "Lightweight jacket." },
        { id: 106, name: "Beige Chinos", category: "men", price: 40, quantity: 40, img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500", desc: "Comfortable beige chinos." },
        { id: 107, name: "Grey Hoodie", category: "men", price: 50, quantity: 60, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500", desc: "Warm grey hoodie." },
        { id: 108, name: "Denim Shirt", category: "men", price: 48, quantity: 30, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500", desc: "Rugged denim shirt." },
        { id: 109, name: "Graphic Tee", category: "men", price: 22, quantity: 80, img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500", desc: "Cool graphic t-shirt." },
        { id: 110, name: "Puffer Vest", category: "men", price: 70, quantity: 20, img: "https://www.tascperformance.com/cdn/shop/files/09_PufferVest_Shale_MotionPantTailored_PimaluxeLS_BlackBlack_023.jpg?v=1736893427", desc: "Winter puffer vest." },
        { id: 111, name: "Sweatpants", category: "men", price: 35, quantity: 50, img: "https://img.kwcdn.com/product/fancy/8b08b843-13a6-4a91-874c-c55e55d059da.jpg", desc: "Cozy sweatpants." },
        { id: 112, name: "Cardigan", category: "men", price: 55, quantity: 25, img: "https://image.msscdn.net/thumbnails/images/goods_img/20210831/2100446/2100446_17636860367042_big.jpg", desc: "Stylish knit cardigan." },
        { id: 113, name: "Trench Coat", category: "men", price: 120, quantity: 10, img: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500", desc: "Classic trench coat." },
        { id: 114, name: "Cargo Shorts", category: "men", price: 30, quantity: 45, img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500", desc: "Utility cargo shorts." },
        { id: 115, name: "Tuxedo Jacket", category: "men", price: 150, quantity: 5, img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500", desc: "Formal tuxedo jacket." },

        // WOMEN (15 items)
        { id: 201, name: "Floral Dress", category: "women", price: 32, quantity: 40, img: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500", desc: "Gentle floral pattern." },
        { id: 202, name: "Crop Top", category: "women", price: 18, quantity: 60, img: "https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=500", desc: "Dynamic crop top." },
        { id: 203, name: "Midi Skirt", category: "women", price: 28, quantity: 25, img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500", desc: "Pleated midi skirt." },
        { id: 204, name: "Wide Pants", category: "women", price: 38, quantity: 35, img: "https://d32xbmzryof2yc.cloudfront.net/sites/files/6style/images/products/202406/800xAUTO/24.jpg", desc: "High waist pants." },
        { id: 205, name: "Korean Blazer", category: "women", price: 58, quantity: 10, img: "https://img.joomcdn.net/c9380987cc9b1a0967d6c2015ecea463b90217d8_original.jpeg", desc: "Trendy oversized blazer." },
        { id: 206, name: "Cocktail Dress", category: "women", price: 80, quantity: 15, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500", desc: "Evening cocktail dress." },
        { id: 207, name: "Skinny Jeans", category: "women", price: 45, quantity: 50, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500", desc: "High stretch skinny jeans." },
        { id: 208, name: "Silk Blouse", category: "women", price: 60, quantity: 20, img: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500", desc: "Smooth silk blouse." },
        { id: 209, name: "Leather Skirt", category: "women", price: 50, quantity: 10, img: "https://www.albaray.co.uk/cdn/shop/files/5056487367896_2.jpg?v=1719564839&width=2048", desc: "Faux leather mini skirt." },
        { id: 210, name: "Oversized Hoodie", category: "women", price: 55, quantity: 30, img: "https://m.media-amazon.com/images/I/81qPdhpjp-L._AC_UY1000_.jpg", desc: "Comfy oversized hoodie." },
        { id: 211, name: "Knit Sweater", category: "women", price: 40, quantity: 40, img: "https://fridayknits.com/cdn/shop/files/Chunkycableknit2.jpg?v=1717565368&width=1946", desc: "Warm knit sweater." },
        { id: 212, name: "High-Low Dress", category: "women", price: 75, quantity: 12, img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500", desc: "Party high-low dress." },
        { id: 213, name: "Jumpsuit", category: "women", price: 65, quantity: 18, img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500", desc: "Chic jumpsuit." },
        { id: 214, name: "Denim Shorts", category: "women", price: 25, quantity: 60, img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500", desc: "Summer denim shorts." },
        { id: 215, name: "Evening Gown", category: "women", price: 200, quantity: 3, img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500", desc: "Luxury evening gown." }
    ];

    const users = [
        { id: 1, fullname: "Administrator", email: "admin@gmail.com", password: "123", role: "admin", storeName: "The L.A.M Store" }
    ];

    const orders = [];
    const ledger = [];
    const customerNames = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia"];

    // Loop 12 tháng năm 2025
    for (let month = 0; month < 12; month++) {
        let targetRevenue = Math.floor(Math.random() * (2000 - 700) + 700);
        if (month === 1) targetRevenue *= 1.3; // Feb
        if (month === 3) targetRevenue *= 1.2; // Apr
        if (month === 10) targetRevenue *= 1.5; // Nov
        if (month === 11) targetRevenue *= 1.6; // Dec

        let currentRevenue = 0;
        while (currentRevenue < targetRevenue) {
            const cusName = customerNames[Math.floor(Math.random() * customerNames.length)];
            const userEmail = `${cusName.toLowerCase()}@gmail.com`;

            if (!users.find(u => u.email === userEmail)) {
                users.push({ id: users.length + 1, fullname: cusName, email: userEmail, password: "123", role: "customer", phone: "0123456789", address: "London, UK" });
            }

            // TẠO ĐƠN HÀNG (Đơn có thể nhiều món)
            const isMultiItem = Math.random() > 0.7; // 30% đơn hàng có nhiều món
            const numItems = isMultiItem ? Math.floor(Math.random() * 2) + 2 : 1; // 1 hoặc 2-3 món
            const orderItems = [];
            let orderTotal = 0;

            for (let k = 0; k < numItems; k++) {
                const prod = products[Math.floor(Math.random() * products.length)];
                const qty = Math.floor(Math.random() * 2) + 1;
                orderTotal += prod.price * qty;
                orderItems.push({ name: prod.name, qty: qty, price: prod.price });
            }

            const orderId = `ORD-2025${month + 1}-${orders.length + 1}`;
            const orderDate = new Date(2025, month, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];

            orders.push({
                id: orderId,
                customer_name: cusName,
                customer_phone: "0123456789",
                customer_address: "London, UK",
                date: orderDate,
                total: orderTotal,
                status: "completed",
                items: orderItems
            });

            ledger.push({ trx_id: `TRX-${orders.length}`, order_id: orderId, amount: orderTotal, recorded_date: orderDate });
            currentRevenue += orderTotal;
        }
    }

    // TẠO THÊM ĐƠN HÀNG GẦN ĐÂY (PENDING / SHIPPING)
    // Giả lập tháng hiện tại là tháng 12
    const recentStatuses = ['pending', 'shipping', 'pending', 'shipping'];
    for (let i = 0; i < recentStatuses.length; i++) {
        const prod = products[Math.floor(Math.random() * products.length)];
        const cusName = customerNames[Math.floor(Math.random() * customerNames.length)];
        const orderId = `ORD-NOW-${i + 1}`;
        orders.push({
            id: orderId,
            customer_name: cusName,
            customer_phone: "0123456789",
            customer_address: "Manchester, UK",
            date: new Date().toISOString().split('T')[0],
            total: prod.price,
            status: recentStatuses[i],
            items: [{ name: prod.name, qty: 1, price: prod.price }]
        });
    }

    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    localStorage.setItem(DB_KEYS.LEDGER, JSON.stringify(ledger));
    console.log("Client: Full Data Seeded!");
}

let allProducts = JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS)) || [];
let currentPage = 1;
const itemsPerPage = 8;
let currentCategory = 'all';
let cartItems = [];
let wishlistItems = [];
let checkoutItemsTemp = [];

document.addEventListener('DOMContentLoaded', function () {
    if (!localStorage.getItem(DB_KEYS.PRODUCTS)) { initDynamicData(); }
    allProducts = JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS)) || [];
    renderProducts();
    updateAuthUI();
    startCountdown();
});

function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER));
    const adminLink = document.getElementById('adminLink');
    if (user) {
        if (user.role === 'admin') adminLink.classList.remove('d-none');
        cartItems = user.cart || [];
        wishlistItems = user.wishlist || [];
        updateCartBadge();
        document.getElementById('wishlist-count').innerText = wishlistItems.length;
        document.getElementById('wishlist-count').style.display = wishlistItems.length > 0 ? 'block' : 'none';
    } else {
        adminLink.classList.add('d-none');
        cartItems = []; wishlistItems = [];
        updateCartBadge();
        document.getElementById('wishlist-count').style.display = 'none';
    }
}

function renderProducts(directSearch = null) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    allProducts = JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS)) || [];
    let filtered = allProducts;
    if (directSearch) filtered = filtered.filter(p => p.name.toLowerCase().includes(directSearch.toLowerCase()));
    else if (currentCategory !== 'all') filtered = allProducts.filter(p => p.category === currentCategory);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;
    const start = (currentPage - 1) * itemsPerPage;
    const itemsToShow = filtered.slice(start, start + itemsPerPage);

    if (itemsToShow.length === 0) container.innerHTML = '<div class="text-center w-100 py-5">No products found.</div>';
    else {
        itemsToShow.forEach(p => {
            const oldPrice = p.old_price || 0;
            const priceDisplay = oldPrice > 0 ? `<span class="old-price">${formatCurrency(oldPrice)}</span> ${formatCurrency(p.price)}` : formatCurrency(p.price);
            const badge = oldPrice > 0 ? `<span class="badge bg-danger position-absolute top-0 start-0 m-3">-Sale</span>` : '';
            container.innerHTML += `<div class="col-6 col-md-3 product-item fade-in"><div class="product-card"><div class="product-img-wrap">${badge}<img src="${p.img}"><div class="product-actions"><button class="btn-action" onclick="openAddToCartModal(${p.id})"><i class="fa-solid fa-cart-plus"></i></button><button class="btn-action" onclick="buyNowSingle(${p.id})"><i class="fa-solid fa-bolt"></i></button><button class="btn-action" onclick="openProductDetailModal(${p.id})"><i class="fa-regular fa-eye"></i></button><button class="btn-action btn-wishlist" onclick="toggleWishlist(${p.id})"><i class="fa-regular fa-heart"></i></button></div></div><div class="product-info"><div class="product-category">${p.category}</div><h5 class="product-title" onclick="openProductDetailModal(${p.id})">${p.name}</h5><div class="product-price">${priceDisplay}</div></div></div></div>`;
        });
    }
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const nav = document.getElementById('pagination-controls');
    nav.innerHTML = '';
    if (totalPages <= 1) return;
    for (let i = 1; i <= totalPages; i++) { nav.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="javascript:void(0)" onclick="changePage(${i})">${i}</a></li>`; }
}
function changePage(page) { if (page < 1) return; currentPage = page; renderProducts(); document.getElementById('shop').scrollIntoView(); }
function filterAndScroll(cat) { currentCategory = cat; currentPage = 1; document.getElementById('shop-title').innerText = cat === 'all' ? 'All Products' : (cat.charAt(0).toUpperCase() + cat.slice(1) + "'s Fashion"); renderProducts(); document.getElementById('shop').scrollIntoView(); }
function viewCollection(cat) { document.getElementById('btn-back-all').classList.remove('d-none'); filterAndScroll(cat); }
function resetFilters() { document.getElementById('btn-back-all').classList.add('d-none'); filterAndScroll('all'); }
function resetHome() { resetFilters(); window.scrollTo(0, 0); }
function toggleSearch() { const container = document.getElementById('searchContainer'); container.classList.toggle('active'); if (container.classList.contains('active')) document.getElementById('searchInput').focus(); }
function searchProducts() { const val = document.getElementById('searchInput').value; currentPage = 1; renderProducts(val); document.getElementById('shop').scrollIntoView(); }

function handleUserIconClick() {
    const user = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER));
    if (user) {
        document.getElementById('profileName').innerText = user.fullname;
        document.getElementById('profileEmail').innerText = user.email;
        new bootstrap.Modal(document.getElementById('userProfileModal')).show();
    } else {
        showForm('login');
        new bootstrap.Modal(document.getElementById('loginRequireModal')).show();
    }
}
function showForm(type) {
    document.getElementById('signInForm').classList.add('d-none');
    document.getElementById('signUpForm').classList.add('d-none');
    document.getElementById('forgotForm').classList.add('d-none');
    if (type === 'login') document.getElementById('signInForm').classList.remove('d-none');
    else if (type === 'signup') document.getElementById('signUpForm').classList.remove('d-none');
    else if (type === 'forgot') document.getElementById('forgotForm').classList.remove('d-none');
}

// --- AUTH LOGIC ---
function signIn() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;

    if (!Validator.isEmail(email)) return alert("Please enter a valid email!");
    if (pass.length === 0) return alert("Please enter your password!");

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || [];
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
        localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
        bootstrap.Modal.getInstance(document.getElementById('loginRequireModal')).hide();
        location.reload();
    } else { alert('Invalid credentials! (Try: admin@gmail.com / 123)'); }
}

function signUp() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;

    if (!Validator.isLength(name, 3)) return alert("Name must be at least 3 characters!");
    if (!Validator.isEmail(email)) return alert("Invalid email address!");
    if (!Validator.isLength(pass, 6)) return alert("Password must be at least 6 characters!");

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || [];
    if (users.some(u => u.email === email)) return alert("Email already exists!");

    users.push({ id: Date.now(), fullname: name, email: email, password: pass, role: "customer", cart: [], wishlist: [] });
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    alert("Account created successfully! Please Sign In.");
    showForm('login');
}
function logout() { localStorage.removeItem(DB_KEYS.CURRENT_USER); location.reload(); }

function getProduct(id) { allProducts = JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS)) || []; return allProducts.find(p => p.id === id); }
function openAddToCartModal(id) { if (!localStorage.getItem(DB_KEYS.CURRENT_USER)) return handleUserIconClick(); const p = getProduct(id); if (!p) return; document.getElementById('cartModalTitle').innerText = p.name; document.getElementById('cartModalDesc').innerText = p.desc; document.getElementById('cartModalPrice').innerText = formatCurrency(p.price); document.getElementById('cartModalImg').src = p.img; document.getElementById('btnConfirmAddToCart').onclick = () => addToCart(id); new bootstrap.Modal(document.getElementById('addToCartModal')).show(); }
function addToCart(id) {
    if (!localStorage.getItem(DB_KEYS.CURRENT_USER)) return handleUserIconClick();
    const p = getProduct(id);
    const qty = parseInt(document.getElementById('cartModalQty').value) || 1;
    if (qty < 1) return alert("Quantity must be at least 1");
    const size = document.querySelector('input[name="cartSize"]:checked').nextElementSibling.innerText;
    const user = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER));
    if (!user.cart) user.cart = [];
    const existingItem = user.cart.find(i => i.id === p.id && i.size === size);
    if (existingItem) { existingItem.quantity += qty; } else { user.cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, size: size, quantity: qty }); }
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    cartItems = user.cart; updateCartBadge(); bootstrap.Modal.getInstance(document.getElementById('addToCartModal')).hide(); showToast("Added to Cart!");
}
function updateCartBadge() { document.getElementById('cart-count').innerText = cartItems.reduce((sum, i) => sum + i.quantity, 0); }

// --- UX: Close Detail Modal before opening Cart Modal ---
function openProductDetailModal(id) {
    const p = getProduct(id);
    if (!p) return;
    document.getElementById('detailTitle').innerText = p.name;
    document.getElementById('detailPrice').innerText = formatCurrency(p.price);
    document.getElementById('detailDesc').innerText = p.desc;
    document.getElementById('detailImg').src = p.img;
    // Changed: Call new function to handle transition
    document.getElementById('btnDetailAddToCart').onclick = () => closeDetailAndOpenCart(id);
    new bootstrap.Modal(document.getElementById('productDetailModal')).show();
}

function closeDetailAndOpenCart(id) {
    // Close detail modal first
    const detailModal = bootstrap.Modal.getInstance(document.getElementById('productDetailModal'));
    if (detailModal) detailModal.hide();
    // Open cart modal
    setTimeout(() => openAddToCartModal(id), 200); // Wait small delay for better UX
}

function openCartDisplay() { if (!localStorage.getItem(DB_KEYS.CURRENT_USER)) return handleUserIconClick(); renderCartItems(); new bootstrap.Modal(document.getElementById('cartModal')).show(); }
function renderCartItems() {
    const container = document.getElementById('cartModalBody');
    const totalEl = document.getElementById('cartTotal');
    if (cartItems.length === 0) { container.innerHTML = '<p class="text-center text-muted">Cart is empty.</p>'; totalEl.innerText = '$0'; }
    else { let html = '<div class="vstack gap-3">'; let total = 0; cartItems.forEach((item, idx) => { total += item.price * item.quantity; html += `<div class="d-flex gap-3 border-bottom pb-3"><img src="${item.img}" class="modal-item-img"><div class="flex-grow-1"><h6 class="mb-0">${item.name}</h6><small class="text-muted">Size: ${item.size} x ${item.quantity}</small><br><strong>${formatCurrency(item.price * item.quantity)}</strong></div><i class="fa-solid fa-trash-can modal-remove-btn text-danger" style="cursor:pointer" onclick="removeCartItem(${idx})"></i></div>`; }); html += '</div>'; container.innerHTML = html; totalEl.innerText = formatCurrency(total); }
}
function removeCartItem(idx) { cartItems.splice(idx, 1); const user = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER)); user.cart = cartItems; localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user)); updateCartBadge(); renderCartItems(); }
function toggleWishlist(id) { if (!localStorage.getItem(DB_KEYS.CURRENT_USER)) return handleUserIconClick(); const p = getProduct(id); const user = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER)); if (!user.wishlist) user.wishlist = []; if (!user.wishlist.find(i => i.id === id)) { user.wishlist.push(p); showToast("Added to Wishlist"); } else { user.wishlist = user.wishlist.filter(i => i.id !== id); showToast("Removed from Wishlist"); } localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user)); wishlistItems = user.wishlist; document.getElementById('wishlist-count').innerText = wishlistItems.length; document.getElementById('wishlist-count').style.display = wishlistItems.length > 0 ? 'block' : 'none'; }
function openWishlistModal() { if (!localStorage.getItem(DB_KEYS.CURRENT_USER)) return handleUserIconClick(); renderWishlist(); new bootstrap.Modal(document.getElementById('wishlistModal')).show(); }
function renderWishlist() { const container = document.getElementById('wishlistModalBody'); if (wishlistItems.length === 0) container.innerHTML = '<p class="text-center text-muted">Wishlist is empty.</p>'; else { let html = '<div class="vstack gap-3">'; wishlistItems.forEach(item => { html += `<div class="d-flex gap-3 border-bottom pb-3 align-items-center"><img src="${item.img}" class="modal-item-img"><div class="flex-grow-1"><h6 class="mb-0">${item.name}</h6><strong>${formatCurrency(item.price)}</strong></div><div class="d-flex gap-2"><button class="btn btn-sm btn-outline-danger" onclick="removeFromWishlist(${item.id})"><i class="fa-solid fa-trash"></i></button><button class="btn btn-sm btn-dark" onclick="addFromWishlistToCart(${item.id})">Add to Cart</button></div></div>`; }); html += '</div>'; container.innerHTML = html; } }
function removeFromWishlist(id) { const user = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER)); user.wishlist = user.wishlist.filter(i => i.id !== id); localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user)); wishlistItems = user.wishlist; document.getElementById('wishlist-count').innerText = wishlistItems.length; document.getElementById('wishlist-count').style.display = wishlistItems.length > 0 ? 'block' : 'none'; renderWishlist(); }
function addFromWishlistToCart(id) { const wishModal = bootstrap.Modal.getInstance(document.getElementById('wishlistModal')); wishModal.hide(); openAddToCartModal(id); }

function buyNowSingle(id) { if (!localStorage.getItem(DB_KEYS.CURRENT_USER)) return handleUserIconClick(); const p = getProduct(id); checkoutItemsTemp = [{ id: p.id, name: p.name, price: p.price, img: p.img, size: 'M', quantity: 1 }]; proceedToCheckout('single'); }
function proceedToCheckout(source) {
    if (source === 'cart') { if (cartItems.length === 0) return; checkoutItemsTemp = [...cartItems]; bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide(); }
    const user = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER));
    if (user) { document.getElementById('chkName').value = user.fullname || ""; document.getElementById('chkPhone').value = user.phone || ""; document.getElementById('chkAddress').value = user.address || ""; }
    const list = document.getElementById('checkoutItemsList'); let total = 0; list.innerHTML = '';
    checkoutItemsTemp.forEach(item => { total += item.price * item.quantity; list.innerHTML += `<div class="checkout-summary-item"><div><strong>${item.name}</strong> <small>(${item.size} x${item.quantity})</small></div><span>${formatCurrency(item.price * item.quantity)}</span></div>`; });
    document.getElementById('checkoutTotalAmount').innerText = formatCurrency(total);
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
}

// --- CHECKOUT LOGIC ---
function finalPlaceOrder() {
    const name = document.getElementById('chkName').value.trim();
    const phone = document.getElementById('chkPhone').value.trim();
    const address = document.getElementById('chkAddress').value.trim();
    const payment = document.getElementById('chkPayment').value;

    if (!Validator.isLength(name, 3)) return alert('Please enter your full name!');
    if (!Validator.isPhone(phone)) return alert('Invalid phone number!');
    if (!Validator.isLength(address, 5)) return alert('Please enter a specific address!');

    // Check stock availability before placing order
    let stockError = false;
    checkoutItemsTemp.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (!product) {
            stockError = true;
            alert(`Product "${item.name}" no longer exists!`);
        } else if (product.quantity < item.quantity) {
            stockError = true;
            alert(`Not enough stock for "${item.name}"! Available: ${product.quantity}, Requested: ${item.quantity}`);
        }
    });

    if (stockError) return;

    // Deduct quantity from products
    checkoutItemsTemp.forEach(item => {
        const productIndex = allProducts.findIndex(p => p.id === item.id);
        if (productIndex !== -1) {
            allProducts[productIndex].quantity -= item.quantity;
        }
    });
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(allProducts));

    const total = checkoutItemsTemp.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const newOrder = {
        id: "ORD-" + Date.now(),
        user_id: 0,
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        date: new Date().toISOString().split('T')[0],
        total: total,
        status: 'pending',
        payment_method: payment,
        items: checkoutItemsTemp
    };

    const orders = JSON.parse(localStorage.getItem(DB_KEYS.ORDERS)) || [];
    orders.unshift(newOrder);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));

    cartItems = []; updateCartBadge();
    const user = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER));
    if (user) { user.cart = []; localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user)); }

    bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
    alert('Order placed successfully! Thank you.');

    // Refresh product display to show updated quantities
    renderProducts();
}

function startCountdown() { const endDate = new Date(); endDate.setDate(endDate.getDate() + 3); setInterval(() => { const now = new Date().getTime(); const distance = endDate - now; if (distance < 0) return; document.getElementById("days").innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'); document.getElementById("hours").innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'); document.getElementById("minutes").innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'); document.getElementById("seconds").innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0'); }, 1000); }
function showToast(msg) { document.getElementById('toastMessage').innerText = msg; new bootstrap.Toast(document.getElementById('cartToast')).show(); }
