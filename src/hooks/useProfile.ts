import type { Profile } from "../types";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export const useProfile = (userId: string | null) => {
  const [user, setUser] = useState<Profile>({
    firstName: "",
    lastName: "",
    avatar: "",
  });

  const fetchUserProfile = async () => {
    if (!userId) {
      setUser({ firstName: "", lastName: "", avatar: "" }); // <- clear
      return; // if no user is logged in clear user state and skip fetching profile
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

  return { user, fetchUserProfile };
};
