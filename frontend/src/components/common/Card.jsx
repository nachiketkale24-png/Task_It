export default function Card({ children }) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-12 shadow-sm text-gray-900">
      {children}
    </div>
  );
}