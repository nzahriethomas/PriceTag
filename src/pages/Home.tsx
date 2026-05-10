import React from "react";
import { CreateListing } from "../components/CreateListing";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useSession } from "../components/UserRouting";

export const Home = () => {
  // Check if user is authenticated
  const { isAuthenticated } = useSession();
  // Listings hdden slide-in menu for create listings form.
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* <CreateListing /> */}
      <div className=" min-h-screen pt-5 flex flex-col items-center gap-10">
        <h1 className="text-3xl font-bold text-center font-light">
          Welcome to PriceTag
        </h1>
        {
          isAuthenticated ? (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="bg-orange-600 font-semibold text-white py-2 px-4 rounded-2xl hover:bg-sky-300 transition duration-300"
            >
              Create Listing
            </button>
          ) : null // dont show create listing button if not authenticated
        }
        {isOpen && <CreateListing onClose={() => setIsOpen(false)} />}
      </div>
    </>
  );
};
