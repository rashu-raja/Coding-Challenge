import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";

function Register() {
  const { login, designations, departments } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    password: "",
    password_confirmation: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("designation", formData.designation);
    data.append("department", formData.department);
    data.append("password", formData.password);
    data.append("password_confirmation", formData.password_confirmation);

    if (profilePic) {
      data.append("profile_picture", profilePic);
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setError(Object.values(result.errors).flat().join(", "));
        } else {
          setError(result.message || "Registration failed");
        }
        return;
      }

      login(result.token, result.user);
      navigate("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen pt-16 bg-base-100">
      <form
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border border-base-300 rounded-2xl w-full max-w-lg shadow-xl p-7 space-y-5"
      >
        <div className="flex justify-center">
          <legend className="fieldset-legend text-3xl font-bold text-primary">
            Register
          </legend>
        </div>

        <div className="text-left space-y-1">
          <label className="label text-sm font-semibold text-base-content">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="input input-bordered w-full text-base-content"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-left space-y-1">
          <label className="label text-sm font-semibold text-base-content">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="input input-bordered w-full text-base-content"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-left space-y-1">
          <label className="label text-sm font-semibold text-base-content">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            className="input input-bordered w-full text-base-content"
            placeholder="98******88"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-left space-y-1">
          <label className="label text-sm font-semibold text-base-content">
            Designation
          </label>
          <select
            name="designation"
            className="select select-bordered w-full text-base-content"
            value={formData.designation}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Designation
            </option>
            {designations.map((d) => (
              <option key={d.designation} value={d.designation}>
                {d.designation}
              </option>
            ))}
          </select>
        </div>
        <div className="text-left space-y-1">
          <label className="label text-sm font-semibold text-base-content">
            Department
          </label>
          <select
            name="department"
            className="select select-bordered w-full text-base-content"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Department
            </option>
            {departments.map((d) => (
              <option key={d.department} value={d.department}>
                {d.department}
              </option>
            ))}
          </select>
        </div>

        <div className="text-left space-y-1">
          <label className="label text-sm font-semibold text-base-content">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <div className="avatar placeholder">
              <div className="mask mask-squircle h-14 w-14 bg-base-300">
                {preview ? (
                  <img src={preview} alt="preview" />
                ) : (
                  <span className="text-base-content/40 text-xs text-center">
                    No img
                  </span>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) => {
                const file = e.target.files[0];
                setProfilePic(file);
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </div>
        </div>

        <div className="text-left space-y-1">
          <label className="label text-sm font-semibold text-base-content">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="input input-bordered w-full text-base-content"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-left space-y-1">
          <label className="label text-sm font-semibold text-base-content">
            Confirm Password
          </label>
          <input
            type="password"
            name="password_confirmation"
            className="input input-bordered w-full text-base-content"
            placeholder="Confirm Password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="alert alert-error py-2 text-sm">
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full rounded-lg shadow-md hover:shadow-lg transition"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Register"
          )}
        </button>

        <p className="text-center text-sm text-base-content/60">
          Already have an account?{" "}
          <Link to="/" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
