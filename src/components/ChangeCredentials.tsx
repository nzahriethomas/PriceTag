import React from "react";
import { supabase } from "../utils/supabase";

export const ChangeCredentials = ({
  onClose,
  onStateChange,
  mode,
}: {
  onClose: () => void;
  onStateChange: () => void;
  mode: "email" | "password";
}) => {
  // State declarations
  const [form, setForm] = React.useState({
    value: "", // This will hold either the new email or the new password based on the mode
    confirm: "", // This will hold the confirmation value for password change
  });

  // Helper functions
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Supabase profile management - if user has made it this far they already have been authenticated so an additional check is not required here.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Get the current authentifcated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      alert("User authentication error. Please log in again.");
      return;
    }
    // User ID is needed for email change to update the email in the users table in Supabase database. Password change does not require userId as it is handled by Supabase auth and does not require a database update to change the email in the users table. This is because the email is only stored in the auth.users table and not duplicated in the users profile table which allows for more efficient updates to user credentials without having to worry about keeping multiple tables in sync with each other.
    const userId = authData.user.id;

    if (mode === "email") {
      const { error: emailError } = await supabase.auth.updateUser({
        email: form.value,
      });

      if (emailError) {
        alert(emailError.message);
        return;
      }
    }
    if (mode === "password") {
      if (form.value !== form.confirm) {
        alert("Passwords do not match. Please try again.");
        return;
      }
      const { error: passwordError } = await supabase.auth.updateUser({
        password: form.value,
      });
      if (passwordError) {
        alert(passwordError.message);
        return;
      }
    }
    setForm({ value: "", confirm: "" }); // Reset form after successful update
    alert("Credentials updated successfully!");
    onStateChange(); // Trigger any additional state changes needed in parent component after credential update
    onClose(); // Close the credential change form after successful update
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        {/* Form for editing email */}
        {(mode === "email" && (
          <form
            className="bg-sky-400 rounded-2xl w-75 px-10 py-10 flex flex-col gap-6 m-auto"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="value"
              value={form.value}
              onChange={handleChange}
              placeholder="Email"
              className="outline p-2 rounded-lg bg-white font-light"
            />
            {/* Buttons to submit the form to Supabase or cancel effectively closing the container */}
            <button
              type="submit"
              className="bg-orange-600 font-semibold text-white py-2 px-4 rounded-2xl hover:bg-gray-600 transition duration-300"
            >
              Change Email
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 font-semibold text-white py-2 px-4 rounded-2xl hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          </form>
        )) ||
          (mode === "password" && (
            <form
              className="bg-sky-400 rounded-2xl w-75 px-10 py-10 flex flex-col gap-6 m-auto"
              onSubmit={handleSubmit}
            >
              <input
                type="password"
                name="value"
                value={form.value}
                onChange={handleChange}
                placeholder="New Password"
                className="outline p-2 rounded-lg bg-white font-light"
              />
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Confirm New Password"
                className="outline p-2 rounded-lg bg-white font-light"
              />
              {/* Buttons to submit the form to Supabase or cancel effectively closing the container */}
              <button
                type="submit"
                className="bg-orange-600 font-semibold text-white py-2 px-4 rounded-2xl hover:bg-gray-600 transition duration-300"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 font-semibold text-white py-2 px-4 rounded-2xl hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </form>
          ))}
      </div>
    </div>
  );
};
