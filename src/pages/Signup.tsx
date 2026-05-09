import { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router";

// import primaryLogo from "../assets/pricetag-logo.png";

export const Signup = () => {
  // Variable declarations
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Navigation hook
  const navigate = useNavigate();

  // Helper functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Supabase user signup authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    // Handle potential authentication error
    if (error) {
      alert(error.message);
      return;
    }
    // Create user profile in "profiles" table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user?.id,
      firstName: form.firstName,
      lastName: form.lastName,
    });
    // Handle potential profile creation error
    if (profileError) {
      alert(profileError.message);
      return;
    }
    // Redirect to profile page upon successful signup
    if (data.user) {
      navigate("/profile");
    }

    console.log({ data, error });
  };

  return (
    <>
      <div className="flex min-h-screen bg-sky-200">
        <form
          className="bg-white rounded-2xl w-75 px-10 py-10 flex flex-col gap-6 m-auto align-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="rounded-full px-1 py-2"
          />
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="rounded-full px-1 py-2"
          />
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
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="rounded-full px-1 py-2"
          />
          <button
            type="submit"
            className="px-3 py-2 hover:text-sky-100 hover:bg-sky-300 transition duration-300 rounded-full"
          >
            Create account
          </button>
        </form>
      </div>
    </>
  );
};
