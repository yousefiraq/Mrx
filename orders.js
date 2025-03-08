import { db, collection, getDocs, updateDoc, doc, deleteDoc } from "./firebase-config.js";

async function fetchOrders() {
    const tableBody = document.getElementById("ordersTable");
    tableBody.innerHTML = ""; // مسح المحتوى القديم

    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        querySnapshot.forEach((docItem) => {
            const data = docItem.data();
            const row = `
                <tr>
                    <td>${data.name || 'غير متوفر'}</td>
                    <td>${data.phone || 'غير متوفر'}</td>
                    <td>${data.address || 'غير متوفر'}</td>
                    <td>
                        <select class="status-select" data-id="${docItem.id}">
                            <option value="قيد الانتظار" ${data.status === 'قيد الانتظار' ? 'selected' : ''}>قيد الانتظار</option>
                            <option value="تم التوصيل" ${data.status === 'تم التوصيل' ? 'selected' : ''}>تم التوصيل</option>
                            <option value="ملغى" ${data.status === 'ملغى' ? 'selected' : ''}>ملغى</option>
                        </select>
                    </td>
                    <td>
                        <button class="edit-btn" data-id="${docItem.id}">تعديل</button>
                        <button class="delete-btn" data-id="${docItem.id}">حذف</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // إضافة الأحداث بعد تحميل الجدول
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', async () => {
                await updateOrderStatus(select.dataset.id, select.value);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('هل أنت متأكد من الحذف؟')) {
                    await deleteOrder(btn.dataset.id);
                }
            });
        });

    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        alert("تعذر تحميل الطلبات! تأكد من اتصال الإنترنت.");
    }
}

// الدوال المساعدة
async function updateOrderStatus(orderId, newStatus) {
    try {
        await updateDoc(doc(db, "orders", orderId), { status: newStatus });
        alert("تم تحديث الحالة!");
    } catch (error) {
        console.error("خطأ في التحديث:", error);
    }
}

async function deleteOrder(orderId) {
    try {
        await deleteDoc(doc(db, "orders", orderId));
        await fetchOrders(); // إعادة تحميل الجدول
        alert("تم الحذف بنجاح!");
    } catch (error) {
        console.error("خطأ في الحذف:", error);
    }
}

// تحميل البيانات عند فتح الصفحة
window.onload = fetchOrders;
