import { db, collection, getDocs, updateDoc, doc, deleteDoc, getDoc } from "./firebase-config.js";

// البحث عن الطلبات
function searchOrders() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#ordersTable tr');
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        row.style.display = name.includes(searchTerm) ? '' : 'none';
    });
}

let searchTimeout;
document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchOrders, 300);
});

// جلب وتحديث الطلبات
async function fetchOrders() {
    const tableBody = document.getElementById("ordersTable");
    tableBody.innerHTML = "";
    let totalOrders = 0, pending = 0, delivered = 0, canceled = 0;

    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        querySnapshot.forEach((docItem) => {
            const data = docItem.data();
            totalOrders++;
            switch(data.status) {
                case 'قيد الانتظار': pending++; break;
                case 'تم التوصيل': delivered++; break;
                case 'ملغى': canceled++; break;
            }

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
                        <div class="map-actions">
                            <button class="map-btn" onclick="showOrderMap(${data.latitude},${data.longitude})">
                                🌍 عرض الخريطة
                            </button>
                            <button class="google-btn" onclick="openGoogleMaps(${data.latitude},${data.longitude})">
                                🗺️ فتح في Google Maps
                            </button>
                            <button class="waze-btn" onclick="openWaze(${data.latitude},${data.longitude})">
                                🚗 فتح في Waze
                            </button>
                        </div>
                    </td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${docItem.id}">✏️ تعديل</button>
                        <button class="action-btn delete-btn" data-id="${docItem.id}">🗑️ حذف</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // تحديث العدادات
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('pendingOrders').textContent = pending;
        document.getElementById('deliveredOrders').textContent = delivered;
        document.getElementById('canceledOrders').textContent = canceled;

        // إضافة الأحداث
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', async () => {
                await updateOrderStatus(select.dataset.id, select.value);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('هل أنت متأكد من الحذف؟')) await deleteOrder(btn.dataset.id);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                await editOrderDetails(btn.dataset.id);
            });
        });

        searchOrders();
    } catch (error) {
        console.error("حدث خطأ في جلب البيانات:", error);
        alert("تعذر تحميل الطلبات!");
    }
}

// حذف الطلب
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

// تحديث حالة الطلب
async function updateOrderStatus(orderId, newStatus) {
    try {
        await updateDoc(doc(db, "orders", orderId), { status: newStatus });
        await fetchOrders();
    } catch (error) {
        console.error("خطأ في التحديث:", error);
        alert("فشل في تحديث الحالة!");
    }
}

// تعديل تفاصيل الطلب
async function editOrderDetails(orderId) {
    try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const newName = prompt("الاسم الحالي: " + data.name + "\n\nأدخل الاسم الجديد:", data.name);
            const newPhone = prompt("الهاتف الحالي: " + data.phone + "\n\nأدخل الهاتف الجديد:", data.phone);
            const newAddress = prompt("العنوان الحالي: " + data.address + "\n\nأدخل العنوان الجديد:", data.address);
            
            if (newName !== null && newPhone !== null && newAddress !== null) {
                await updateDoc(docRef, {
                    name: newName || data.name,
                    phone: newPhone || data.phone,
                    address: newAddress || data.address
                });
                await fetchOrders();
                alert("تم التحديث بنجاح!");
            }
        }
    } catch (error) {
        console.error("خطأ في التعديل:", error);
        alert("فشل في التحديث: " + error.message);
    }
}

window.onload = fetchOrders;
