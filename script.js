// โหลดข้อมูลตะกร้าจาก Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ฟังก์ชันเพิ่มสินค้าในตะกร้า
function addToCart(productName, productPrice) {
    // ตรวจสอบว่าสินค้ามีอยู่ในตะกร้าหรือไม่
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        // ถ้ามีอยู่แล้ว เพิ่มจำนวนสินค้า
        existingProduct.quantity += 1;
    } else {
        // ถ้ายังไม่มี เพิ่มสินค้าใหม่
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    // บันทึกข้อมูลกลับไปที่ Local Storage
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${productName} has been added to your cart!`);
}


// ฟังก์ชันแสดงสินค้าในตะกร้า
function displayCart() {
    const cartTableBody = document.querySelector(".cart-table tbody");
    const cartTotal = document.querySelector(".cart-total h3");

    // โหลดข้อมูลจาก Local Storage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalAmount = 0;

    // ล้างข้อมูลเดิมในตาราง
    cartTableBody.innerHTML = "";

    // เพิ่มสินค้าแต่ละรายการในตาราง
    storedCart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        const row = `
            <tr>
                <td>${item.name}</td>
                <td>฿${item.price}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" 
                           onchange="updateQuantity(${index}, this.value)" />
                </td>
                <td>฿${itemTotal}</td>
                <td><button onclick="removeFromCart('${item.name}')">Remove</button></td>
            </tr>
        `;
        cartTableBody.innerHTML += row;
    });

    // อัปเดตราคาสุทธิ
    cartTotal.textContent = `Total: ฿${totalAmount}`;
}

// ฟังก์ชันปรับจำนวนสินค้าในตะกร้า
function updateQuantity(index, newQuantity) {
    // โหลดข้อมูลตะกร้าจาก Local Storage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    // อัปเดตจำนวนสินค้า
    storedCart[index].quantity = parseInt(newQuantity);

    // บันทึกข้อมูลกลับไปใน Local Storage
    localStorage.setItem("cart", JSON.stringify(storedCart));

    // อัปเดตการแสดงผล
    displayCart();
}

// ฟังก์ชันลบสินค้าออกจากตะกร้า
function removeFromCart(productName) {
    // ลบสินค้าที่ตรงกับชื่อที่ระบุ
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart(); // อัปเดตการแสดงผล
}

// ฟังก์ชัน Checkout
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Add some items before checking out!");
        return;
    }

    // แสดงข้อความยืนยัน
    alert("Thank you for your purchase! Your order has been placed.");

    // ล้างข้อมูลในตะกร้า
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    // อัปเดตการแสดงผลใน cart.html
    displayCart();
}

// โหลดข้อมูลตะกร้าทันทีที่เปิดหน้า
document.addEventListener("DOMContentLoaded", displayCart);


// ฟังก์ชันสร้าง QR Code สำหรับ PromptPay
function generatePromptPayQRCode() {
    const amount = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2); // คำนวณยอดรวม
    const promptPayID = "0952863971"; // หมายเลข PromptPay (เบอร์โทรศัพท์/เลขบัญชี)

    // สร้างข้อมูล PromptPay (Static QR Code)
    const payloadFormatIndicator = "000201";
    const pointOfInitiationMethod = "010212"; // Static QR
    const merchantAccountInfo = `29370016A000000677010111011300669${promptPayID}`;
    const transactionCurrency = "5303764"; // ใช้สกุลเงิน THB
    const transactionAmount = `54${String(amount).length}${amount}`;
    const crcPlaceholder = "6304";

    // รวมข้อมูลทั้งหมดเพื่อสร้าง QR String
    const qrString = `${payloadFormatIndicator}${pointOfInitiationMethod}${merchantAccountInfo}${transactionCurrency}${transactionAmount}${crcPlaceholder}`;

    // สร้าง QR Code
    const qrCodeContainer = document.getElementById("qrcode");
    qrCodeContainer.innerHTML = ""; // ล้าง QR Code เก่าก่อน
    QRCode.toCanvas(qrCodeContainer, qrString, { width: 200 }, function (error) {
        if (error) {
            console.error("Error generating QR Code:", error);
        } else {
            alert("PromptPay QR Code generated. Please scan to pay.");
        }
    });
}

function searchProducts() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase(); // คำที่พิมพ์ในแถบค้นหา
    const productItems = document.querySelectorAll(".product-item"); // ดึงข้อมูลสินค้าทั้งหมด

    productItems.forEach(item => {
        const productName = item.querySelector("h3").textContent.toLowerCase(); // ชื่อสินค้า
        const productDescription = item.querySelector("p")?.textContent.toLowerCase() || ""; // คำอธิบายสินค้า (ถ้ามี)

        // แสดงหรือซ่อนสินค้าขึ้นอยู่กับการค้นหา
        if (productName.includes(searchValue) || productDescription.includes(searchValue)) {
            item.style.display = "block"; // แสดงสินค้า
        } else {
            item.style.display = "none"; // ซ่อนสินค้า
        }
    });
}
