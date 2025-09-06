// frontend/src/pages/BuyerProfile.jsx
export default function BuyerProfile() {
  const name = localStorage.getItem("name") || "Buyer";

  return (
    <div className="container my-4">
      <h2>User Profile</h2>
      <p>Welcome, <strong>{name}</strong>!</p>
      <p>Here you'll manage your orders, messages, and preferences.</p>
    </div>
  );
}