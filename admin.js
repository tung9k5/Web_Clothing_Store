const DB_KEYS = { PRODUCTS: "moda_products", USERS: "moda_users", ORDERS: "moda_orders", LEDGER: "moda_revenue_ledger", CURRENT_USER: "moda_current_user" };
const NEED_RESET_DB = false;

function formatCurrency(amount) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount); }
function safeRedirect(url) { if (window.location.protocol === 'blob:') { alert("Preview mode."); return; } window.location.href = url; }

let products, orders, ledger, users, currentUser;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER));
    if (!currentUser || currentUser.role !== 'admin') { alert('Access Denied.'); safeRedirect('main.html'); }
    else { updateStoreUI(); refreshAll(); }
});

// --- RESET DATA ON TOGGLE ---
function toggleImgInput(type) {
    // Logic hiển thị
    if (type === 'url') {
        document.getElementById('urlInputGroup').style.display = 'block';
        document.getElementById('fileInputGroup').style.display = 'none';
    } else {
        document.getElementById('urlInputGroup').style.display = 'none';
        document.getElementById('fileInputGroup').style.display = 'block';
    }

    // Logic RESET: Xóa sạch dữ liệu cũ khi chuyển tab
    document.getElementById('prodImgURL').value = "";
    document.getElementById('prodImgInput').value = "";
    document.getElementById('prodImgData').value = ""; // Xóa dữ liệu ẩn
    document.getElementById('prodImgPreview').src = "";
    document.getElementById('prodImgPreview').style.display = 'none';
    document.getElementById('prodImgPlaceholder').style.display = 'block';
}

function previewUrlImage() {
    const url = document.getElementById('prodImgURL').value;
    if (url) {
        document.getElementById('prodImgPreview').src = url;
        document.getElementById('prodImgPreview').style.display = 'block';
        document.getElementById('prodImgPlaceholder').style.display = 'none';
        document.getElementById('prodImgData').value = url;
    }
}

function handleImageUpload() {
    const fileInput = document.getElementById('prodImgInput');
    const file = fileInput.files[0];

    if (file) {
        if (file.size > 1000000) alert("Warning: Large image file! Consider using URL link for performance.");
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64String = e.target.result;
            document.getElementById('prodImgPreview').src = base64String;
            document.getElementById('prodImgPreview').style.display = 'block';
            document.getElementById('prodImgPlaceholder').style.display = 'none';
            document.getElementById('prodImgData').value = base64String;
        };
        reader.readAsDataURL(file);
    }
}

function updateStoreUI() {
    document.getElementById('sidebarStoreName').innerHTML = `${currentUser.storeName || 'The L.A.M'} <span style="color: var(--accent-color);">ADMIN</span>`;
    document.getElementById('headerUserName').innerText = currentUser.fullname || "Administrator";
}

function refreshAll() {
    products = JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS)) || [];
    orders = JSON.parse(localStorage.getItem(DB_KEYS.ORDERS)) || [];
    ledger = JSON.parse(localStorage.getItem(DB_KEYS.LEDGER)) || [];
    users = JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || [];
    renderDashboard(); renderProducts(); renderOrders();
}

function renderDashboard() {
    const totalRev = ledger.reduce((sum, item) => sum + item.amount, 0);
    document.getElementById('dashRevenue').innerText = formatCurrency(totalRev);
    document.getElementById('dashPending').innerText = orders.filter(o => o.status === 'pending').length;
    document.getElementById('dashProducts').innerText = products.length;
    document.getElementById('dashCustomers').innerText = users.filter(u => u.role === 'customer').length;
    const sales = {};
    orders.forEach(o => { if (o.status === 'completed') o.items.forEach(i => { sales[i.name] = (sales[i.name] || 0) + i.qty; }); });
    const sorted = Object.entries(sales).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const list = document.getElementById('topSellingList');
    list.innerHTML = sorted.length ? '' : '<li class="list-group-item">No completed orders yet</li>';
    sorted.forEach(([n, q]) => list.innerHTML += `<li class="list-group-item d-flex justify-content-between">${n}<span class="badge bg-primary rounded-pill">${q} Sold</span></li>`);
}

function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';
    const search = document.getElementById('prodSearch').value.toLowerCase();
    products.filter(p => p.name.toLowerCase().includes(search)).forEach(p => {
        let qty = p.quantity !== undefined ? p.quantity : 0;
        let stockStatus = qty > 10 ? 'In Stock' : (qty > 0 ? 'Low Stock' : 'Out of Stock');
        let badgeClass = qty > 10 ? 'bg-success' : (qty > 0 ? 'bg-warning text-dark' : 'bg-danger');
        tbody.innerHTML += `<tr><td>${p.id}</td><td><img src="${p.img}" width="40" height="50" style="object-fit:cover; border-radius:4px"></td><td>${p.name}</td><td>${p.category}</td><td>${formatCurrency(p.price)}</td><td><span class="badge ${badgeClass}">${stockStatus} (${qty})</span></td><td>
                    <div class="btn-group"><button class="btn btn-sm btn-outline-primary" onclick="openProductModal('edit', ${p.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button></div></td></tr>`;
    });
}
function searchAdminProducts() { renderProducts(); }

function openProductModal(mode, id = null) {
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    document.getElementById('prodImgInput').value = "";
    document.getElementById('prodImgURL').value = "";

    if (mode === 'edit') {
        const p = products.find(x => x.id === id);
        document.getElementById('prodModalTitle').innerText = "Edit Product";
        document.getElementById('prodId').value = p.id;
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodPrice').value = p.price;
        document.getElementById('prodQty').value = p.quantity;
        document.getElementById('prodDesc').value = p.desc;
        document.getElementById('prodCat').value = p.category;
        document.getElementById('prodImgData').value = p.img;

        if (p.img && p.img.startsWith('data:')) {
            document.getElementById('sourceFile').checked = true;
            toggleImgInput('file');
        } else {
            document.getElementById('sourceUrl').checked = true;
            toggleImgInput('url');
            document.getElementById('prodImgURL').value = p.img;
        }
        document.getElementById('prodImgData').value = p.img;
        if (p.img) {
            document.getElementById('prodImgPreview').src = p.img;
            document.getElementById('prodImgPreview').style.display = 'block';
            document.getElementById('prodImgPlaceholder').style.display = 'none';
        }
    } else {
        document.getElementById('prodModalTitle').innerText = "Add Product";
        document.getElementById('prodId').value = "";
        document.getElementById('prodName').value = "";
        document.getElementById('prodPrice').value = "";
        document.getElementById('prodQty').value = "10";
        document.getElementById('prodDesc').value = "";

        document.getElementById('sourceUrl').checked = true;
        toggleImgInput('url');
        document.getElementById('prodImgData').value = "https://placehold.co/300x400";
    }
    modal.show();
}

// --- SAVE PRODUCT WITH VALIDATION ---
function saveProduct() {
    const id = document.getElementById('prodId').value;
    const name = document.getElementById('prodName').value.trim();
    const cat = document.getElementById('prodCat').value;
    const price = parseFloat(document.getElementById('prodPrice').value);
    const qty = parseInt(document.getElementById('prodQty').value);
    const img = document.getElementById('prodImgData').value || "https://placehold.co/300x400";
    const desc = document.getElementById('prodDesc').value;

    if (name.length === 0) return alert("Please enter product name!");
    if (isNaN(price) || price <= 0) return alert("Price must be a positive number!");
    if (isNaN(qty) || qty < 0) return alert("Stock quantity invalid!");

    if (id) {
        const idx = products.findIndex(p => p.id == id);
        products[idx] = { ...products[idx], name, category: cat, price, quantity: qty, img, desc };
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 101;
        products.push({ id: newId, name, category: cat, price, quantity: qty, img, desc, created_at: new Date().toISOString().split('T')[0] });
    }
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    refreshAll(); bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
}
function deleteProduct(id) { if (confirm("Are you sure you want to delete this product?")) { products = products.filter(p => p.id !== id); localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products)); refreshAll(); } }

function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';
    orders.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(o => {
        let itemsHtml = o.items.map(i => `<div>- ${i.name} x${i.qty}</div>`).join('');
        let badgeClass = o.status === 'completed' ? 'bg-success' : (o.status === 'shipping' ? 'bg-info text-dark' : (o.status === 'canceled' ? 'bg-danger' : 'bg-warning text-dark'));
        let displayStatus = o.status === 'completed' ? 'Completed' : (o.status === 'shipping' ? 'Shipping' : (o.status === 'canceled' ? 'Canceled' : 'Pending'));
        tbody.innerHTML += `<tr><td>${o.id}</td><td>${o.customer_name}<br><small>${o.customer_phone}</small></td><td style="font-size:0.8rem">${o.customer_address}</td><td class="col-items">${itemsHtml}</td><td>${formatCurrency(o.total)}</td><td><span class="badge ${badgeClass}">${displayStatus}</span></td>
                <td><div class="btn-action-group"><button class="btn btn-sm btn-outline-dark" title="View" onclick="viewOrder('${o.id}')"><i class="fa-solid fa-eye"></i></button>
                <button class="btn btn-sm btn-primary" title="Next Status" onclick="cycleStatus('${o.id}')"><i class="fa-solid fa-arrow-right"></i></button></div></td></tr>`;
    });
}
function viewOrder(id) {
    const o = orders.find(x => x.id === id);
    const html = `<p><strong>Customer:</strong> ${o.customer_name} - ${o.customer_phone}</p><p><strong>Address:</strong> ${o.customer_address}</p><table class="table table-sm"><thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead><tbody>${o.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${formatCurrency(i.price)}</td></tr>`).join('')}</tbody></table><h5 class="text-end text-danger">Total: ${formatCurrency(o.total)}</h5>`;
    document.getElementById('orderDetailContent').innerHTML = html;
    new bootstrap.Modal(document.getElementById('orderDetailModal')).show();
}

function cycleStatus(id) {
    const idx = orders.findIndex(x => x.id === id);
    const current = orders[idx].status;
    let nextStatus = current === 'pending' ? 'shipping' : (current === 'shipping' ? 'completed' : 'pending');
    if (nextStatus === 'completed') {
        if (!ledger.find(l => l.order_id === id)) ledger.push({ trx_id: "TRX-" + Date.now(), order_id: id, amount: orders[idx].total, recorded_date: new Date().toISOString().split('T')[0] });
    } else if (current === 'completed') ledger = ledger.filter(l => l.order_id !== id);
    orders[idx].status = nextStatus;
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    localStorage.setItem(DB_KEYS.LEDGER, JSON.stringify(ledger));
    refreshAll();
}

function openStoreModal() {
    document.getElementById('editStoreName').value = currentUser.storeName || "The L.A.M Store";
    document.getElementById('editUserName').value = currentUser.fullname || "Administrator";
    new bootstrap.Modal(document.getElementById('storeModal')).show();
}
function saveStoreSettings() {
    const storeName = document.getElementById('editStoreName').value.trim();
    const userName = document.getElementById('editUserName').value.trim();

    if (storeName.length === 0) return alert("Store Name cannot be empty!");

    currentUser.storeName = storeName;
    currentUser.fullname = userName;
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    updateStoreUI();
    bootstrap.Modal.getInstance(document.getElementById('storeModal')).hide();
}

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(e => { e.classList.remove('active', 'fade-in'); if (e.id === id + '-section') { e.classList.add('active'); setTimeout(() => e.classList.add('fade-in'), 10); } });
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const links = document.querySelectorAll('.nav-link');
    for (let link of links) { if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(id)) link.classList.add('active'); }
    if (id === 'analytics') initCharts();
}

function initCharts() {
    const year = parseInt(document.getElementById('yearSelect').value);
    const months = Array(12).fill(0);
    ledger.forEach(l => { const d = new Date(l.recorded_date); if (d.getFullYear() === year) months[d.getMonth()] += l.amount; });
    if (window.revChart) window.revChart.destroy();
    window.revChart = new Chart(document.getElementById('revenueChart'), { type: 'bar', data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], datasets: [{ label: `Revenue ${year}`, data: months, backgroundColor: '#1a1a1a' }] } });

    const cats = { men: 0, women: 0 };
    let totalSales = 0;
    orders.forEach(o => { if (o.status === 'completed') o.items.forEach(i => { const p = products.find(x => x.name === i.name); if (p) { if (!cats[p.category]) cats[p.category] = 0; cats[p.category]++; totalSales++; } }); });
    if (window.catChart) window.catChart.destroy();
    window.catChart = new Chart(document.getElementById('categoryChart'), { type: 'doughnut', data: { labels: ['Men', 'Women'], datasets: [{ data: [cats.men, cats.women], backgroundColor: ['#1a1a1a', '#c5a992'] }] }, options: { plugins: { tooltip: { callbacks: { label: function (c) { return `${c.label}: ${c.raw} (${totalSales > 0 ? Math.round((c.raw / totalSales) * 100) : 0}%)`; } } } } } });
}
function handleExport() { alert('Exporting report simulated successfully!'); }
function logout() { localStorage.removeItem(DB_KEYS.CURRENT_USER); safeRedirect('main.html'); }