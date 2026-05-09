import { Link } from "react-router";
// Media & graphic imports
import primaryLogo from "../assets/pricetag-logo.png";
import { FaUserAlt } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import { useSession } from "./UserRouting";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export const Navbar = () => {
  // State declarations
  const { isAuthenticated, userId } = useSession();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
  });

  // Fetch user profile data if authenticated

  useEffect(() => {
    // Fetch user profile data from "profiles" table
    const fetchUserProfile = async () => {
      if (!isAuthenticated) {
        setUser({ firstName: "", lastName: "" }); // ← clear on logout
        return; // If not authenticated, skip fetching profile and ensure user state is clean
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userId)
        .single();

      if (data) {
        setUser({ firstName: data.first_name, lastName: data.last_name });
      }
      if (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    // Container
    <nav className="max-h-[85px] flex items-center justify-between fixed top-0 bg-sky-400 shadow-lg w-full">
      <div className="flex items-center py-3 px-4">
        {/* Logo & Core Nav - Left */}
        <Link to="/">
          <img
            src={primaryLogo}
            alt="PriceTag Logo"
            className=" h-[85px] w-auto"
          />
        </Link>
      </div>

      {/* Search bar / Filter */}
      {/* <div className="flex items-center py-3 px-4">

      </div> */}

      {/* Authentication Actions - Right */}
      <div className="flex items-center py-3 px-4">
        {isAuthenticated ? (
          //show Welcome message if user is authenticated
          <span className="text-white md:text-lg mr-4">
            {user.firstName ? `Welcome back, ${user.firstName}!` : null}
          </span>
        ) : (
          <>
            {" "}
            <Link
              to="/login"
              className="py-2 px-4 md:text-lg text-white hover:text-sky-300 rounded-2xl transition duration-300 underline"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="py-2 px-4 md:text-lg text-white hover:text-sky-300 rounded-2xl transition duration-300 underline"
            >
              Register
            </Link>
          </>
        )}

        <Link
          to="/profile"
          className="py-2 px-4 md:text-lg text-white hover:text-sky-300 rounded-2xl transition duration-300"
        >
          <FaUserAlt className="md:h-[25px] md:w-auto" />
        </Link>
        {
          isAuthenticated ? (
            // Show logout button if user is authenticated
            <Link
              onClick={handleLogout}
              to="/"
              className="py-2 px-4 md:text-lg font-bold text-white hover:text-sky-300 rounded-2xl transition duration-300"
            >
              <RxExit className="md:h-[25px] md:w-auto" />
            </Link>
          ) : null /* Don't show logout button if user is not authenticated */
        }
      </div>
    </nav>
  );
};
