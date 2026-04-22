import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || { general: data.message });
        return;
      }

      login(data.user, data.token);
      navigate("/");
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-2">Create account</h2>
          <p className="text-base-content/60 mb-6">Get started for free</p>

          {errors.general && (
            <div className="alert alert-error mb-4">
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                required
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name[0]}
                  </span>
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                required
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email[0]}
                  </span>
                </label>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                required
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password[0]}
                  </span>
                </label>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.password_confirmation ? "input-error" : ""
                }`}
                required
              />
              {errors.password_confirmation && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password_confirmation[0]}
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full mt-2 ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
