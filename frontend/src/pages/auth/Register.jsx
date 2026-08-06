import api from "../../services/api";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
        setLoading(true);

        const response = await api.post("/auth/register", {
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
        });

        alert(response.data.message);

        navigate("/login");

    } catch (error) {

        alert(
            error.response?.data?.message ||
            "Registration failed"
        );

    } finally {

        setLoading(false);

    }
};

  return (
    <div className="min-h-screen bg-white flex">

      {/* LEFT PANEL */}

      <div className="hidden lg:flex w-1/2 border-r border-gray-200 items-center justify-center px-20">

        <div className="max-w-md">

          <div className="flex items-center gap-3 mb-8">

            <div className="bg-gray-900 text-white p-3 rounded-xl">
              <FiCheckCircle size={28} />
            </div>

            <h1 className="text-4xl font-bold">
              Task It
            </h1>

          </div>

          <h2 className="text-5xl font-bold leading-tight text-gray-900">
            Start collaborating,
            <br />
            today.
          </h2>

          <p className="mt-6 text-lg text-gray-500 leading-8">
            Create projects, assign tasks, collaborate with
            teammates and manage everything from one clean
            workspace.
          </p>

          <div className="mt-12 border-l-4 border-gray-900 pl-6">

            <p className="italic text-gray-600">
              "Great things are built together."
            </p>

            <p className="mt-3 font-medium">
              — Task It
            </p>

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex flex-1 items-center justify-center px-8">

        <Card>

          <h2 className="text-3xl font-bold">
            Create Account
          </h2>

          <p className="mt-2 text-gray-500">
            Join Task It and organize your work.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
          >

            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <Button type="submit">
                {loading ? "Creating Account..." : "Create Account"}
            </Button>

          </form>

          <p className="mt-8 text-center text-gray-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-gray-900 hover:underline"
            >
              Sign In
            </Link>

          </p>

        </Card>

      </div>

    </div>
  );
}

export default Register;