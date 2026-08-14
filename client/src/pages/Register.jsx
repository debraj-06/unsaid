import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(form);

      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f5f9] px-4 py-10 dark:bg-[#121116]">

      <div className="w-full max-w-[420px]">

        <Link
          to="/"
          className="mx-auto grid h-11 w-11 place-items-center rounded-[15px] bg-[#2b2532] font-bold text-white dark:bg-[#eee8ff] dark:text-[#2b2532]"
        >
          u
        </Link>

        <div className="mt-6 text-center">

          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Make a space for your thoughts.
          </h1>

          <p className="mt-2 text-sm text-[#968c9c]">
            One username. One password. That's all.
          </p>

        </div>

        <div className="mt-8 rounded-[28px] border border-[#e8e1ea] bg-white p-6 shadow-[0_20px_60px_rgba(63,46,79,0.06)] dark:border-[#2e2834] dark:bg-[#1b191f] sm:p-7">

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <div>

              <label className="mb-2 block text-xs font-semibold">
                Username
              </label>

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                type="text"
                autoComplete="username"
                placeholder="choose_a_username"
                className="h-12 w-full rounded-[16px] border border-[#e3dce6] bg-[#faf8fb] px-4 text-sm outline-none focus:border-[#82708f] dark:border-[#3a3340] dark:bg-[#151319] dark:text-white"
              />

            </div>

            <div>

              <label className="mb-2 block text-xs font-semibold">
                Password
              </label>

              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                className="h-12 w-full rounded-[16px] border border-[#e3dce6] bg-[#faf8fb] px-4 text-sm outline-none focus:border-[#82708f] dark:border-[#3a3340] dark:bg-[#151319] dark:text-white"
              />

            </div>

            <div>

              <label className="mb-2 block text-xs font-semibold">
                Confirm password
              </label>

              <input
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                className="h-12 w-full rounded-[16px] border border-[#e3dce6] bg-[#faf8fb] px-4 text-sm outline-none focus:border-[#82708f] dark:border-[#3a3340] dark:bg-[#151319] dark:text-white"
              />

            </div>

            <button
              disabled={loading}
              className="h-12 w-full rounded-[16px] bg-[#2c2632] text-sm font-semibold text-white transition hover:bg-[#3a3142] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#eee8ff] dark:text-[#2c2632]"
            >
              {loading
                ? "Creating your space..."
                : "Create my space"}
            </button>

          </form>

          <p className="mt-6 text-center text-xs text-[#968c9c]">
            Already have a space?

            <Link
              to="/login"
              className="ml-1 font-semibold text-[#3d3245] dark:text-[#e7dcef]"
            >
              Enter it
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;