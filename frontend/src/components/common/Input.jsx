import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? (showPassword ? "text" : "password")
      : type;

  return (
    <div className="flex flex-col gap-2">

      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">

        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 px-4 py-3 pr-12 outline-none transition-all duration-200
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
          }`}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}

      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}