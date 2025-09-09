// frontend/src/pages/OrderHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading order history...</p>;

  return (
    <div className="container my-4">
      <h2>📦 Order History</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} className="card mb-3">
              <div className="card-body">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Total:</strong> K{order.total}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt.seconds * 1000).toLocaleString()}</p>
                <p><strong>Hash:</strong> {order.transactionHash}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}