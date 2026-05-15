import { CreateListing } from "../components/CreateListing";
import { useState } from "react";
import { useSession } from "../components/UserRouting";
import { ListingCard } from "../components/ListingCard";
import { useListings } from "../hooks/useListings";

export const Home = () => {
  // Check if user is authenticated and pass through userId for user specific requests among listings.
  const { userId } = useSession();

  // Listings hdden pop-up menu for create listings form.
  const [isOpen, setIsOpen] = useState(false);

  const { generalListings, fetchListings } = useListings(null);

  return (
    <>
      <div className=" min-h-screen pt-5 flex flex-col items-center gap-10">
        <h1 className="text-3xl font-bold text-center font-light">
          Welcome to PriceTag
        </h1>
        {
          userId ? (
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
          {generalListings && generalListings.length > 0 ? (
            generalListings.map((listing) => (
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
