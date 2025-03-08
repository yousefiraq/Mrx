import { db, collection, getDocs, updateDoc, doc, deleteDoc, getDoc } from "./firebase-config.js";

// دالة البحث عن الطلبات
function searchOrders() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#ordersTable tr');
    
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        row.style.display = name.includes(searchTerm) ? '' : 'none';
    });
}

// إضافة حدث البحث مع تأخير 300ms
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchOrders, 300);
});

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

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                await editOrderDetails(btn.dataset.id);
            });
        });

        document.getElementById('searchInput').value = '';
        searchOrders();

    } catch (error) {
        console.error("حدث خطأ في جلب البيانات:", error);
        alert("تعذر تحميل الطلبات!");
    }
}

// بقية الدوال (deleteOrder, updateOrderStatus, editOrderDetails) كما هي...
