import React from "react";
import { useState } from "react";
import { supabase } from "../utils/supabase";

export const CreateListing = ({
  onClose,
  onListingChange,
}: {
  onClose: () => void;
  onListingChange: () => void;
}) => {
  // State declarations
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
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

  // Supabase user signup authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Upload image to Supabase storage
    const { data, error } = await supabase.storage
      .from("listings")
      .upload(`images/${Date.now()}_${image?.name}`, image as File);
    // Handle potential upload error
    if (error) {
      alert(error.message);
      onClose();
      return;
    }
    // Get public URL of the uploaded image
    const { data: urlData } = supabase.storage
      .from("listings")
      .getPublicUrl(data.path);

    // Handle potential URL retrieval error
    if (!urlData.publicUrl) {
      alert("Failed to retrieve image URL");
      return;
    }

    // Insert listing data into "listings" table
    const { error: listingError } = await supabase.from("listings").insert({
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      image_url: urlData.publicUrl,
    });
    // Handle potential listing creation error
    if (listingError) {
      alert(listingError.message);
      return;
    }
    // Clear form after successful submission
    setForm({ title: "", description: "", price: "" });
    setImage(null);
    onClose(); // Close the create listing form after submission
    onListingChange(); // Refresh listings on home page after creating a new listing
  };

  return (
    <>
      {/* Modal overlay for create listing form */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          {/* Form for creating a new listing with fields for title, description, price, and image upload */}
          <form
            className="bg-sky-400 rounded-2xl w-75 px-10 py-10 flex flex-col gap-6 m-auto"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="outline p-2 rounded-lg bg-white font-light"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="outline p-2 rounded-lg bg-white font-light"
            />
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
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
              Create Listing
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
