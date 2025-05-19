const apiUrl = 'http://localhost:8000'; 
let token = localStorage.getItem('accessToken');

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        document.getElementById('add-drug-link').style.display = 'inline';
        document.querySelector('a[href="login.html"]').style.display = 'none';
    } else {
    
        document.getElementById('add-drug-link').style.display = 'none';
    }

    loadProducts();
});


function loadProducts() {
    fetch(`${apiUrl}/products/`, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    })
        .then((res) => {
            if (!res.ok) throw new Error('Помилка при отриманні продуктів');
            return res.json();
        })
        .then((data) => renderProducts(data))
        .catch((error) => {
            console.error(error);
            window.location.href = 'error.html';
        });
}

function renderProducts(products) {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    products.forEach((product) => {
        const card = document.createElement('div');
        card.className = 'drug-card';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p>Кількість: ${product.quantity}</p>
            <p>Ціна: ${product.price} ₴</p>
            <div class="drug-actions">
                <button onclick="viewDrug(${product.id})">Переглянути</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function viewDrug(id) {
    window.location.href = `view-drug.html?id=${id}`;
}

console.log('Access Token:', localStorage.getItem('accessToken'));
