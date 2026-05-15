import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { CreateListing } from "../components/CreateListing";
import { ListingCard } from "../components/ListingCard";
import { useSession } from "../components/UserRouting";
import { useProfile } from "../hooks/useProfile";
// Media imports
import { MdEdit } from "react-icons/md";
// Importing types
import { ManageProfile } from "../components/ManageProfile";
import { useListings } from "../hooks/useListings";

export const Profile = () => {
  // Listings hdden pop-up menu for create listings form.
  const [isListingOpen, setIsListingOpen] = React.useState(false);
  // Profile edit hidden pop-up menu for profile management form.
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Check if user is authenticated using userId which is used for specific listingfiltering.
  const { userId } = useSession();
  // Custom hook to fetch user profile data.
  const { user, fetchUserProfile } = useProfile(userId);

  const { userListings, fetchListings } = useListings(userId);

  return (
    <>
      {/* Profile Header */}
      <section className="bg-gray-200 flex items-end w-full pt-10 gap-4 p-4">
        <div className="flex justify-items-end gap-4">
          {/* Render Profile image if it exists; otherwise, render default icon */}
          {!user.avatar ? (
            <FaUserAlt className="h-[50px] w-auto md:h-[50px] md:w-auto" />
          ) : (
            <img
              src={user.avatar}
              alt="Profile"
              className="h-[50px] w-auto md:h-[50px] md:w-auto rounded-full"
            />
          )}
          <span className="flex flex-col text-2xl md:text-4xl md:justify-center">
            {user.firstName} {user.lastName}
          </span>
        </div>
        {/* Profile Actions */}
        <div>
          {isProfileOpen && (
            <ManageProfile
              onClose={() => setIsProfileOpen(false)}
              onStateChange={fetchUserProfile}
            />
          )}
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="py-2 px-4 cursor-pointer hover:text-orange-500 rounded-2xl transition duration-300"
          >
            <MdEdit className="h-6 w-6" />
          </button>
        </div>
        {/* Profile Content */}
      </section>
      <section className="text-center p-4 min-h-screen rounded-2xl shadow-md">
        <button
          type="button"
          onClick={() => setIsListingOpen(true)}
          className="bg-orange-600 font-semibold text-white py-2 px-4 rounded-2xl hover:bg-gray-600 transition duration-300"
        >
          Create Listing
        </button>
        {isListingOpen && (
          <CreateListing
            onClose={() => setIsListingOpen(false)}
            onListingChange={fetchListings}
          />
        )}
        {/* Show the total number of listings owned by the user */}
        {userListings.length === 1 ? (
          <p className="pt-3">
            You have <b className="text-xl">{userListings.length}</b> active
            listing.
          </p>
        ) : userListings.length > 1 ? (
          <p className="pt-3">
            You have <b className="text-xl">{userListings.length}</b> active
            listings.
          </p>
        ) : null}
        {/* Row display for listings whereas there is only one listing per row */}
        <div className="flex flex-col pt-3 items-center gap-3">
          {userListings.length > 0 ? (
            userListings.map((listing) => (
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
      </section>
    </>
  );
};
