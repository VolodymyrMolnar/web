document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-drug-form');
    const nameInput = document.getElementById('drug-name');
    const priceInput = document.getElementById('price');
    const quantityInput = document.getElementById('quantity');
    const descriptionInput = document.getElementById('description');
    const stockInput = document.getElementById('in-stock');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');

        if (!token) {
            alert('Потрібно увійти як провізор для додавання препарату');
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/products/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    price: parseFloat(priceInput.value),
                    quantity: parseInt(quantityInput.value),
                    description: descriptionInput.value,
                    in_stock: stockInput.checked
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                console.error('Помилка додавання препарату:', errData);
                alert('Помилка при додаванні препарату');
                return;
            }

            alert('Препарат успішно додано!');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Щось пішло не так...');
        }
    });
});