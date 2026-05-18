import React from "react";
import { supabase } from "../utils/supabase"; // import DB structure for delete functionality
import { Link } from "react-router"; // import navigate for redirecting after delete

// importing types
import type { Listing } from "../types";

export const ListingCard = ({
  listing,
  userId,
  onListingChange,
}: {
  listing: Listing;
  userId: string | null;
  onListingChange: () => void;
}) => {
  // Handle delete listing function, only shows if the listing belongs to the user.
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Deletes the image from supabase storage.
    const imagePath = listing.image_url.split("/public/listings/")[1];
    await supabase.storage.from("listings").remove([imagePath]);
    // Delete listing function
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listing.id);

    if (error) {
      alert("Error deleting listing: " + error.message);
    }
    onListingChange();
  };

  return (
    <>
      <Link to={`/listing/${listing.id}`}>
        {/* Outer card container */}
        <div className="grid md:grid-cols-2 rounded border border-gray-300 justify-around shadow-sm overflow-hiddenmd md:w-full md:max-w-2xl max-w-65">
          {/* Image Section */}
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-auto h-full object-cover duration-500 outline-gray-300 outline-1"
          />
          {/* Details Section */}
          <div className="p-5 text-left bg-orange-100">
            <h2 className="text-xl font-bold overflow-wrap mb-2">
              {listing.title}
            </h2>
            <p className="text-black text-xl">${listing.price.toFixed(2)}</p>
            <p className="text-gray-500">{listing.description}</p>{" "}
            <p className="text-gray-500 italic text-sm mt-2">
              {" "}
              Listed on: {new Date(listing.created_at).toLocaleDateString()}
            </p>
            <br />
            {userId === listing.user_id && (
              <button
                onClick={handleDelete}
                className="bg-red-700 font-semibold text-white py-2 px-4 rounded-2xl hover:bg-gray-600 transition duration-300"
              >
                Delete
              </button>
            )}
          </div>{" "}
        </div>
      </Link>
    </>
  );
};
