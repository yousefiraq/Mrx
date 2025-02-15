document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let phone = document.getElementById("phone").value;
    let quantity = document.getElementById("quantity").value;

    let message = `✅ تم إرسال الطلب!
📌 الاسم: ${name}
🏠 العنوان: ${address}
📞 الهاتف: ${phone}
🔢 العدد: ${quantity}`;
    
    document.getElementById("message").innerText = message;
    this.reset();
});
