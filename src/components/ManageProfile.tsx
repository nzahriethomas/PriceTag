import React from "react";
import { useState } from "react";
import { supabase } from "../utils/supabase";

export const ManageProfile = ({
  onClose,
  onStateChange,
}: {
  onClose: () => void;
  onStateChange: () => void;
}) => {
  // State declarations
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
  });

  // Image state for file upload
  const [image, setImage] = useState<File | null>(null);

  // Helper functions
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files ? e.target.files[0] : null);
  };

  // Supabase user authentication and profile management
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Get the current authentifcated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      alert("Uesr authentication error. Please log in again.");
      return;
    }

    const userId = authData.user.id;
    let avatarUrl = null;

    // Only uplaod image if one was selected
    if (image) {
      const filePath = `images/avatars/${userId}`; // User specific file path for avatar image in Supabase storage allows for easy retrieval and overwriting of existing avatar on profile update. Every user only allowed one avatar.

      // Upload image to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("listings")
        .upload(filePath, image, { upsert: true }); // upsert set to true allows users to overwrite their existing avatar image when they upload a new one without having to manually delete the old image first.

      // Handle potential upload error
      if (uploadError) {
        alert(uploadError.message);
        return;
      }
      // Get public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from("listings")
        .getPublicUrl(filePath);

      avatarUrl = urlData.publicUrl; // Store the public URL of the uploaded avatar image for later use in profile update.
    }

    // Build update object - only include changes that were made to avoid unnecessary updates to the database. This allows users to update just their name or just their avatar without having to re-submit unchanged data. The userId is always included as it's needed for the upsert operation to identify the correct profile record.
    const updates: Record<string, string> = { id: userId };
    if (form.firstName) updates.first_name = form.firstName;
    if (form.lastName) updates.last_name = form.lastName;
    if (avatarUrl) updates.avatar = avatarUrl;

    // Upsert profile data into "profiles" table using the user's unique ID as the primary key.
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    // Handle potential update error
    if (updateError) {
      alert(updateError.message);
      return;
    }

    setForm({ firstName: "", lastName: "" }); // Clear form fields after submission
    setImage(null); // Clear image state after submission

    onClose(); // Close the edit profile form after submission

    onStateChange(); // Refresh profile data.
  };

  return (
    <>
      {/* Modal overlay for edit profile form */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          {/* Form for editing profile with fields for first name, last name, and image upload */}
          <form
            className="bg-sky-400 rounded-2xl w-75 px-10 py-10 flex flex-col gap-6 m-auto"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="outline p-2 rounded-lg bg-white font-light"
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="outline p-2 rounded-lg bg-white font-light"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className=" p-2 rounded-lg bg-yellow-100 font-light"
            />
            {/* Buttons to submit the form to Supabase or cancel effectively closing the container */}
            <button
              type="submit"
              className="bg-orange-600 font-semibold text-white py-2 px-4 rounded-2xl hover:bg-gray-600 transition duration-300"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 font-semibold text-white py-2 px-4 rounded-2xl hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
