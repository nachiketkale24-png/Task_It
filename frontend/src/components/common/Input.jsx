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

      <label className="ui-label">
        {label}
      </label>

      <div className="relative">

        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`ui-input pr-12
          ${
            error
              ? "!border-red-500 focus:!ring-red-200"
              : ""
          }`}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--subtitle-color)] hover:text-[var(--title-color)]"
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






