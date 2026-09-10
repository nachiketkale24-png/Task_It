import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Save JWT Token
      localStorage.setItem("token", response.data.token);

      // Save User (optional)
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data)
      );

      alert(response.data.message || "Login Successful!");

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--main-bg)] text-[var(--title-color)]">
      {/* LEFT PANEL */}
      <div className="hidden w-1/2 items-center justify-center border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] px-20 lg:flex">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-md bg-[var(--accent)] p-3 text-[var(--accent-contrast)]">
              <FiCheckCircle size={28} />
            </div>

            <h1 className="text-4xl font-semibold text-[var(--title-color)]">
              Task It
            </h1>
          </div>

          <h2 className="text-5xl font-semibold leading-tight text-[var(--title-color)]">
            Welcome Back.
            <br />
            Let's get productive.
          </h2>

          <p className="mt-6 text-lg leading-8 text-[var(--subtitle-color)]">
            Continue managing your projects, collaborating with
            teammates, and tracking your progress - all from one
            place.
          </p>

          <div className="mt-12 border-l-2 border-[var(--title-color)] pl-6">
            <p className="italic text-[var(--subtitle-color)]">
              "Success is the sum of small efforts repeated every
              day."
            </p>

            <p className="mt-3 font-medium text-[var(--title-color)]">
              Task It
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="flex flex-1 items-center justify-center px-8">
        <Card>
          <h2 className="text-3xl font-semibold text-[var(--title-color)]">
            Sign In
          </h2>

          <p className="mt-2 text-[var(--subtitle-color)]">
            Welcome back! Please enter your details.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
          >
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[var(--subtitle-color)] transition hover:text-[var(--title-color)]"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit">
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-[var(--subtitle-color)]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--title-color)] hover:underline"
            >
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default Login;






