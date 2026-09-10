export default function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const variants = {
    primary: "ui-button-primary",
    secondary: "ui-button-secondary",
    danger: "ui-button-danger",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ui-button w-full ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}






