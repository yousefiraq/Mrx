document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let formData = {
        name: document.getElementById("name").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value,
        quantity: document.getElementById("quantity").value
    };

    fetch("https://script.google.com/macros/s/AKfycbze554OWTLV7wI8s5xGAawH27EkHCyMZSDZc6IASsGw914XOtMRS2gNVEu0BBSPjhJ0og/exec", {
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
