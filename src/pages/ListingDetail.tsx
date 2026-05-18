import React from "react";
import { useParams } from "react-router";
import { supabase } from "../utils/supabase";

// import types
import type { Listing } from "../types";

export const ListingDetail = () => {
  const { id } = useParams();

  // State variable to hold the listing data.
  const [listing, setListing] = React.useState<Listing | null>(null);

  // Fetch listing data based on the id from the URL parameters.
  React.useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setListing(data);
      }
      if (error) {
        console.error("Error fetching listing:", error);
      }
    };
    fetchListing();
  }, [id]);

  // Show loading state while listing data is being fetched.
  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bg-orange-100 flex flex-col min-h-screen min-w-screen p-10 gap-5">
        <div className="flex flex-col md:flex-row gap-10 border-b-1 border-gray-500 pb-10">
          {/* Image section */}
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-auto max-h-100 bg-white object-cover justify-self-start border-1 border-gray-300 rounded"
          />
          {/* Header Section */}{" "}
          <div className="flex flex-col pt-5 gap-5">
            <h1 className="text-5xl text-wrap font-bold uppercase">
              {" "}
              {listing.title}{" "}
            </h1>
            <p className="text-3xl font-bold text-orange-500">
              {" "}
              ${listing.price.toFixed(2)}{" "}
            </p>
          </div>
        </div>
        {/* Description Section */}
        {/* Check if there exists a description, if so display it otherwise show default text. */}
        {listing.description ? (
          <p className="text-wrap text-gray-700"> {listing.description} </p>
        ) : (
          <p className="text-gray-500 italic"> No description provided. </p>
        )}
      </div>
    </>
  );
};
