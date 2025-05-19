document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const drugId = urlParams.get("id");

    if (!drugId) {
        alert("Не вказано ID препарату в URL. Наприклад: view-drug.html?id=1");
        return;
    }

    fetch(`http://localhost:8000/products/${drugId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Не вдалося отримати дані препарату.");
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("drug-name").textContent = data.name || "Невідомо";
            document.getElementById("drug-price").textContent = `₴${data.price}`;
            document.getElementById("drug-quantity").textContent = data.quantity;
            document.getElementById("drug-instock").textContent = data.in_stock ? "Так" : "Ні";
            document.getElementById("drug-description").textContent = data.description || "Немає опису";

            const buyButton = document.getElementById("buy-button");
            buyButton.disabled = !data.in_stock || data.quantity <= 0;

            buyButton.addEventListener("click", () => {
                const token = localStorage.getItem("accessToken");
                const editLink = document.getElementById("edit-link");

                if (!token) {
                    alert("Для купівлі потрібно увійти в систему.");
                    window.location.href = "login.html";
                    return;
                }
                if (token) {
                    editLink.classList.remove("hidden");
                    editLink.href = `edit-drug.html?id=${data.id}`;
                }
                fetch("http://localhost:8000/buy_product/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`  
                    },
                    body: JSON.stringify({ product_id: data.id })
                })
                .then(res => {
                    if (!res.ok) throw new Error("Помилка при купівлі.");
                    return res.json();
                })
                .then(result => {
                    alert("Придбано успішно!");
                    document.getElementById("drug-quantity").textContent = result.new_quantity;
                    if (result.new_quantity <= 0) {
                        document.getElementById("drug-instock").textContent = "Ні";
                        buyButton.disabled = true;
                    }
                })
                .catch(error => {
                    console.error("Помилка купівлі:", error);
                    alert("Купівля не вдалася.");
                });
            });

        })
        .catch(error => {
            console.error("Помилка завантаження препарату:", error);
            alert("Не вдалося завантажити препарат.");
        });
            const editLink = document.getElementById("edit-link");
    const token = localStorage.getItem("accessToken");

    if (editLink && token) {
        editLink.addEventListener("click", (e) => {
            e.preventDefault(); 
            window.location.href = `edit-drug.html?id=${drugId}`;
        });

        editLink.classList.remove("hidden");
    }
    const deleteButton = document.getElementById("delete-button");

if (deleteButton && token) {
    deleteButton.addEventListener("click", async () => {
        const confirmDelete = confirm("Ви впевнені, що хочете видалити цей препарат?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/products/${drugId}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Помилка при видаленні препарату.");
            }

            alert("Препарат успішно видалено.");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Помилка видалення:", error);
            alert("Не вдалося видалити препарат.");
        }
    });

    deleteButton.classList.remove("hidden");
}

});
