import { db, collection, getDocs, updateDoc, doc, deleteDoc, getDoc } from "./firebase-config.js";

// ... الدوال الأصلية (searchOrders) ...

async function fetchOrders() {
    const tableBody = document.getElementById("ordersTable");
    tableBody.innerHTML = "";

    // إعداد العدادات
    let totalOrders = 0;
    let pending = 0;
    let delivered = 0;
    let canceled = 0;

    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        querySnapshot.forEach((docItem) => {
            const data = docItem.data();
            
            // تحديث العدادات
            totalOrders++;
            switch(data.status) {
                case 'قيد الانتظار': pending++; break;
                case 'تم التوصيل': delivered++; break;
                case 'ملغى': canceled++; break;
            }

            // إنشاء صفوف الجدول
            const row = `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.phone}</td>
                    <td>${data.address}</td>
                    <td>
                        <select class="status-select" data-id="${docItem.id}">
                            <option value="قيد الانتظار" ${data.status === 'قيد الانتظار' ? 'selected' : ''}>قيد الانتظار</option>
                            <option value="تم التوصيل" ${data.status === 'تم التوصيل' ? 'selected' : ''}>تم التوصيل</option>
                            <option value="ملغى" ${data.status === 'ملغى' ? 'selected' : ''}>ملغى</option>
                        </select>
                    </td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${docItem.id}">✏️ تعديل</button>
                        <button class="action-btn delete-btn" data-id="${docItem.id}">🗑️ حذف</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // تحديث DOM بالعدادات
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('pendingOrders').textContent = pending;
        document.getElementById('deliveredOrders').textContent = delivered;
        document.getElementById('canceledOrders').textContent = canceled;

        // ... بقية الكود الأصلي (الأحداث والبحث) ...

    } catch (error) {
        console.error("حدث خطأ في جلب البيانات:", error);
        alert("تعذر تحميل الطلبات!");
    }
}

// تعديل الدوال الأخرى للتحديث التلقائي
async function deleteOrder(orderId) {
    try {
        await deleteDoc(doc(db, "orders", orderId));
        await fetchOrders(); // موجود مسبقًا
        alert("تم الحذف بنجاح!");
    } catch (error) {
        console.error("خطأ في الحذف:", error);
        alert("فشل في حذف الطلب!");
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await updateDoc(doc(db, "orders", orderId), { status: newStatus });
        await fetchOrders(); // إضافة هذا السطر للتحديث
    } catch (error) {
        console.error("خطأ في التحديث:", error);
        alert("فشل في تحديث الحالة!");
    }
}

async function editOrderDetails(orderId) {
    try {
        // ... الكود الأصلي ...
        if (newName !== null && newPhone !== null && newAddress !== null) {
            await updateDoc(docRef, {
                name: newName || data.name,
                phone: newPhone || data.phone,
                address: newAddress || data.address
            });
            await fetchOrders(); // موجود مسبقًا
            alert("تم التحديث بنجاح!");
        }
    } catch (error) {
        console.error("خطأ في التعديل:", error);
        alert("فشل في التحديث: " + error.message);
    }
}

window.onload = fetchOrders;
