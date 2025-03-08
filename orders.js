import { db, collection, getDocs, updateDoc, doc, deleteDoc } from "./firebase-config.js";

async function fetchOrders() {
    const tableBody = document.getElementById("ordersTable");
    tableBody.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        querySnapshot.forEach((docItem) => {
            const data = docItem.data();
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

        // أحداث تحديث الحالة
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', async () => {
                await updateOrderStatus(select.dataset.id, select.value);
            });
        });

        // أحداث الحذف
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                    await deleteOrder(btn.dataset.id);
                }
            });
        });

        // أحداث التعديل
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                await editOrderDetails(btn.dataset.id);
            });
        });

    } catch (error) {
        console.error("حدث خطأ في جلب البيانات:", error);
        alert("تعذر تحميل الطلبات!");
    }
}

async function deleteOrder(orderId) {
    try {
        await deleteDoc(doc(db, "orders", orderId));
        await fetchOrders();
        alert("تم الحذف بنجاح!");
    } catch (error) {
        console.error("خطأ في الحذف:", error);
        alert("فشل في حذف الطلب!");
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (error) {
        console.error("خطأ في التحديث:", error);
        alert("فشل في تحديث الحالة!");
    }
}

async function editOrderDetails(orderId) {
    try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            const newName = prompt("الاسم الجديد:", data.name);
            const newPhone = prompt("الهاتف الجديد:", data.phone);
            const newAddress = prompt("العنوان الجديد:", data.address);
            
            if (newName && newPhone && newAddress) {
                await updateDoc(docRef, {
                    name: newName,
                    phone: newPhone,
                    address: newAddress
                });
                await fetchOrders();
                alert("تم التحديث بنجاح!");
            }
        }
    } catch (error) {
        console.error("خطأ في التعديل:", error);
        alert("فشل في تعديل البيانات!");
    }
}

window.onload = fetchOrders;
