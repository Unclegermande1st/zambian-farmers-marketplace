// frontend/src/components/Button.jsx
export default function Button({ children, variant = "primary", type = "button", onClick, disabled }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}