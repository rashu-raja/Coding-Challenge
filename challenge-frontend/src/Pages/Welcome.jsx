import { useState } from "react";
import { useAuth } from "../Context/AuthProvider";

function Welcome() {
  const { login, isLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      console.log("Invalid response");
      return;
    }

    if (response.ok) {
      login(data.token, data.user);
    } else {
      console.log("error", data);
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        <div className="flex items-start justify-center min-h-screen pt-24 bg-base-100">
          <form
            onSubmit={handleSubmit}
            className="fieldset bg-base-200 border border-base-300 rounded-2xl w-full max-w-md shadow-xl p-7 space-y-5"
          >
            <div className="flex justify-center">
              <legend className="fieldset-legend text-3xl font-bold text-primary ">
                Login
              </legend>
            </div>
            <div className="text-left space-y-1">
              <label className="label text-sm font-semibold text-base-content">
                Email
              </label>
              <input
                type="email"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/40 text-base-content"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="text-left space-y-1">
              <label className="label text-sm font-semibold text-base-content">
                Password
              </label>
              <input
                type="password"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/40 text-base-content"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-lg shadow-md hover:shadow-lg transition"
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="hero bg-linear-to-br from-base-200 to-base-300 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold text-base-content">
                Hello there
              </h1>

              <p className="py-6 text-base-content/70">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>

              <button className="btn btn-primary btn-wide shadow-md hover:shadow-lg transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Welcome;
