document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const drugId = urlParams.get("id");

    if (!drugId) {
        alert("Не вказано ID препарату");
        window.location.href = "index.html";
        return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
        alert("Доступ дозволено лише авторизованим користувачам.");
        window.location.href = "login.html";
        return;
    }

    const nameInput = document.getElementById("drug-name");
    const priceInput = document.getElementById("price");
    const quantityInput = document.getElementById("quantity");  
    const stockInput = document.getElementById("in-stock");
    const descriptionInput = document.getElementById("description");
    console.log("Токен:", token);

    fetch(`http://localhost:8000/products/${drugId}/`)
        .then(res => res.json())
        .then(data => {
            nameInput.value = data.name;
            priceInput.value = data.price;
            quantityInput.value = data.quantity;
            stockInput.checked = data.in_stock;
            descriptionInput.value = data.description || "";
        })
        .catch(err => {
            console.error("Помилка завантаження:", err);
            alert("Не вдалося завантажити препарат.");
        });

    document.getElementById("edit-drug-form").addEventListener("submit", async (e) => {
        e.preventDefault(); 

        try {
            const response = await fetch(`http://localhost:8000/products/${drugId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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
                const errorData = await response.json();
                throw new Error(errorData.error || "Помилка при збереженні.");
            }

            alert("Зміни збережено успішно!");
            window.location.href = `view-drug.html?id=${drugId}`;
        } catch (err) {
            console.error("Помилка збереження:", err);
            alert("Не вдалося зберегти зміни.");
        }
    });
});
