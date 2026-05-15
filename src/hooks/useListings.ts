import type { Listing } from "../types";
import React from "react";
import { supabase } from "../utils/supabase";

export const useListings = (userId: string | null) => {
  // Set state variables for general listing data and user specific listing data.
  const [generalListings, setGeneralListings] = React.useState<Listing[]>([]);
  const [userListings, setUserListings] = React.useState<Listing[]>([]);

  //Fetch listings from supabase and set state variables for general listing data and user specific listing data.
  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false }); // order by newest first.

    if (data) {
      setGeneralListings(data);
      if (userId) {
        const filteredListings = data.filter(
          (listing) => listing.user_id === userId,
        );
        setUserListings(filteredListings);
      }
    }
    if (error) {
      console.error("Error fetching listings:", error);
    }
  };
  React.useEffect(() => {
    fetchListings();
  }, [userId]); // refetch listings when userId changes to ensure userListings is updated accordingly.

  return { generalListings, userListings, fetchListings };
};
