import { useState } from "react";

export const Login = () => {
  // Variable declarations
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Helper functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form); // Placeholder until supabase is wired
  };
  return (
    <>
      <div className="flex min-h-screen bg-sky-200">
        <form
          className="bg-white rounded-2xl w-75 px-10 py-10 flex flex-col gap-6 m-auto align-center"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="rounded-full px-1 py-2"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="rounded-full px-1 py-2"
          />
          <button
            type="submit"
            className="px-3 py-2 hover:text-sky-100 hover:bg-sky-300 transition duration-300 rounded-full"
          >
            Sign in
          </button>
        </form>
      </div>
    </>
  );
};
