export default function Button({
  children,
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        w-full
        rounded-xl
        bg-gray-900
        py-3
        text-white
        font-medium
        transition-all
        duration-200
        hover:bg-black
        active:scale-[0.98]
      "
    >
      {children}
    </button>
  );
}