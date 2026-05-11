import React from "react";
import { CreateListing } from "../components/CreateListing";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useSession } from "../components/UserRouting";
import { ListingCard } from "../components/ListingCard";

// Importing types
import type { Listing } from "../types";

export const Home = () => {
  // Check if user is authenticated and pass through userId for user specific requests among listings.
  const { isAuthenticated, userId } = useSession();

  // Listings hdden slide-in menu for create listings form.
  const [isOpen, setIsOpen] = useState(false);

  // state variable for listing data/
  const [listings, setListings] = useState<Listing[]>([]);

  // Fetch listings from supabase.

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false }); // order by newest first

    if (data) {
      setListings(data);
    }
    if (error) {
      console.error("Error fetching listings:", error);
    }
  };
  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      <div className=" min-h-screen pt-5 flex flex-col items-center gap-10">
        <h1 className="text-3xl font-bold text-center font-light">
          Welcome to PriceTag
        </h1>
        {
          isAuthenticated ? (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="bg-orange-600 font-semibold text-white py-2 px-4 rounded-2xl hover:bg-gray-600 transition duration-300"
            >
              Create Listing
            </button>
          ) : null // dont show create listing button if not authenticated
        }
        {isOpen && (
          <CreateListing
            onClose={() => setIsOpen(false)}
            onListingChange={fetchListings}
          />
        )}
        {/* Row display for listings whereas there is only one listing per row */}
        <div className="flex flex-col items-center gap-3">
          {listings && listings.length > 0 ? (
            listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                userId={userId}
                onListingChange={fetchListings}
              />
            ))
          ) : (
            <p>There are no listings available at this time.</p>
          )}
        </div>
      </div>
    </>
  );
};
