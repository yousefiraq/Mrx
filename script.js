document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let formData = {
        name: document.getElementById("name").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value,
        quantity: document.getElementById("quantity").value
    };

    fetch("AKfycbze554OWTLV7wI8s5xGAawH27EkHCyMZSDZc6IASsGw914XOtMRS2gNVEu0BBSPjhJ0og", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    document.getElementById("message").innerText = "✅ تم إرسال الطلب بنجاح!";
    this.reset();
});
