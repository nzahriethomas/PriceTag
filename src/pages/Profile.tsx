import React from "react";
import { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { supabase } from "../utils/supabase";
import { CreateListing } from "../components/CreateListing";
import { Link } from "react-router";
import { ListingCard } from "../components/ListingCard";
import { useSession } from "../components/UserRouting";

// Importing types
import type { Listing } from "../types";
import { ManageProfile } from "../components/ManageProfile";

export const Profile = () => {
  // Listings hdden slide-in menu for create listings form.
  const [isListingOpen, setIsListingOpen] = useState(false);
  // Profile edit hidden slide-in menu for profile management form.
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // state variable for listing data.
  const [listings, setListings] = useState<Listing[]>([]);

  // Check if user is authenticated and pass through userId for user specific requests among listings.
  const { userId } = useSession();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    avatar: "",
  });

  // Fetch user profile data if authenticated

  const fetchUserProfile = async () => {
    if (!userId) {
      setUser({ firstName: "", lastName: "", avatar: "" }); // ← clear on logout
      return; // If no user is logged in clear user state and skip fetching profile.
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar")
      .eq("id", userId)
      .single();

    if (data) {
      setUser({
        firstName: data.first_name,
        lastName: data.last_name,
        avatar: data.avatar,
      });
    }
    if (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

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

  // Filter listings to only show those that belong to the user.
  const userListings = listings.filter((listing) => listing.user_id === userId);

  return (
    <>
      {/* Profile Header */}
      <section className="bg-gray-200 flex items-end justify-between w-full pt-10 gap-4 p-4">
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
          <span className="flex flex-col text-2xl md:text-4xl md:justify-end">
            {user.firstName} {user.lastName}
          </span>
        </div>
        {/* Profile Actions */}
        <div className="flex md:pl-13 flex-col md:flex-row">
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="py-2 px-4 cursor-pointer hover:text-orange-500 rounded-2xl underline"
          >
            Edit Profile
          </button>
          {isProfileOpen && (
            <ManageProfile
              onClose={() => setIsProfileOpen(false)}
              onStateChange={fetchUserProfile}
            />
          )}
          <p className="flex items-center text-gray-500">|</p>
          <Link to="/settings">
            <button className="py-2 px-4 cursor-pointer hover:text-orange-500 rounded-2xl underline">
              Settings
            </button>
          </Link>
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
