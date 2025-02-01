document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    displayCart();

    // Thêm sản phẩm vào giỏ hàng
    window.addToCart = function (button) {
        let bookDiv = button.closest(".book");
        let name = bookDiv.getAttribute("data-name");
        let price = parseFloat(bookDiv.getAttribute("data-price"));
        let image = bookDiv.getAttribute("data-image");
        let category = bookDiv.getAttribute("data-category") || "Không xác định";

        let existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, image, category, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
        displayCart();
    };

    // Hiển thị giỏ hàng
    function displayCart() {
        let cartTable = document.querySelector("#cart-items");
        let totalPrice = document.querySelector("#total-price");
        cartTable.innerHTML = "";

        let total = 0;

        cart.forEach((item, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.image}" width="50"></td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.price.toLocaleString()} đ</td>
                <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)"></td>
                <td><button onclick="removeItem(${index})">Xóa</button></td>
            `;
            cartTable.appendChild(row);
            total += item.price * item.quantity;
        });

        totalPrice.innerText = total.toLocaleString() + " đ";
    }

    // Cập nhật số lượng sản phẩm
    window.updateQuantity = function (index, newQuantity) {
        if (newQuantity < 1) return;
        cart[index].quantity = parseInt(newQuantity);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    };

    // Xóa sản phẩm khỏi giỏ hàng
    window.removeItem = function (index) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    };

    // Xóa toàn bộ giỏ hàng
    window.clearCart = function () {
        cart = [];
        localStorage.removeItem("cart");
        displayCart();
    };

    // Thanh toán và gửi đơn hàng đến server Node.js
    window.checkout = function () {
        if (cart.length === 0) {
            alert("Giỏ hàng trống, không thể thanh toán!");
            return;
        }
    
        let orderID = "ORDER-" + Date.now(); // Tạo ID đơn hàng dựa vào timestamp hiện tại
        let totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let orderTime = new Date().toLocaleString();
    
        let orderDetails = cart.map(item => ({
            orderID: orderID,
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        }));
    
        let orderSummary = {
            orderID: orderID,
            totalAmount: totalAmount,
            orderTime: orderTime
        };
    
        // Gửi dữ liệu đơn hàng lên server để lưu vào file CSV
        fetch("http://localhost:5000/save_order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ orderDetails, orderSummary })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Phản hồi từ server:", data);
            alert("Thanh toán thành công!");
    
            // Xóa giỏ hàng sau khi thanh toán
            cart = [];
            localStorage.removeItem("cart"); // Cập nhật localStorage
            displayCart();
        })
        .catch(error => console.error("Lỗi:", error));
    };
    
});
