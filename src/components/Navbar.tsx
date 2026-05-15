import React from "react";
import { Link } from "react-router";
import { useSession } from "./UserRouting";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router";
import { useProfile } from "../hooks/useProfile";
import { ChangeCredentials } from "./ChangeCredentials";
// Media & graphic imports
import primaryLogo from "../assets/pricetag-logo.png";
import { FaUserAlt } from "react-icons/fa";

export const Navbar = () => {
  // Check if user is authenticated and pass through userId for user specific requests among listings
  const { userId } = useSession();
  // Custom hook to fetch user profile data
  const { user, fetchUserProfile } = useProfile(userId);

  // Create a ref and attach it to the dropdown wrapper div
  const menuRef = React.useRef<HTMLDivElement>(null);

  const navigate = useNavigate(); // Initialize navigate function for redirection after logout
  const [isMenuOpen, setIsMenuOpen] = React.useState(false); // For drop down menu wired to profile icon
  const [isEmailOpen, setIsEmailOpen] = React.useState(false); // For changing email in the dropdown menu
  const [isPasswordOpen, setIsPasswordOpen] = React.useState(false); // For changing password in the dropdown menu

  // Add the click outside listener
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    navigate("/"); // Redirect to home page after logout
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    // Container
    <nav className="max-h-[85px] flex md:items-center md:justify-between fixed top-0 bg-sky-400 shadow-lg w-full">
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
        {userId ? (
          //show Welcome message if user is authenticated
          <span className="text-white text-sm md:text-lg mr-4">
            {user.firstName ? `Welcome back, ${user.firstName}!` : null}
          </span>
        ) : (
          <>
            {" "}
            <Link
              to="/login"
              className="py-2 px-4 text-sm text-nowrap md:text-lg text-white hover:text-sky-300 rounded-2xl transition duration-300 underline"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="py-2 px-4 text-sm md:text-lg text-white hover:text-sky-300 rounded-2xl transition duration-300 underline"
            >
              Register
            </Link>
          </>
        )}
        {/* Profile dropdown menu container */}
        <div
          className="relative md:pr-6 md:text-lg flex items-center"
          ref={menuRef}
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          {/* Clickable profile icon button - Render user image if it exist otherwise render default icon. */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
          >
            {!user.avatar ? (
              <FaUserAlt className="md:h-[35px] lg:md:w-[35px] text-white rounded-full hover:text-sky-300 transition duration-300" />
            ) : (
              <img
                src={user.avatar}
                alt="Profile"
                className="h-[50px] w-[50px] lg:md:h-[50px] lg:md:w-[50px] rounded-full object-cover hover:opacity-80 transition duration-300"
              />
            )}
          </button>
          {/* Dropdown — absolutely positioned, floats below the icon */}
          {isMenuOpen && userId && (
            <div className="absolute right-0 top-12 text-sm mt-1 w-48 bg-white shadow-lg z-50 overflow-hidden">
              {/* menu items here */}
              <button
                type="button"
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 hover:bg-gray-200"
              >
                👤 Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEmailOpen(true);
                }}
                className="block w-full text-left py-2 px-4 hover:bg-gray-200"
              >
                📧 Change Email
              </button>
              {isEmailOpen && (
                <ChangeCredentials
                  onClose={() => {
                    setIsEmailOpen(false);
                    setIsMenuOpen(false);
                  }}
                  onStateChange={fetchUserProfile}
                  mode="email"
                />
              )}
              {isPasswordOpen && (
                <ChangeCredentials
                  onClose={() => {
                    setIsPasswordOpen(false);
                    setIsMenuOpen(false);
                  }}
                  onStateChange={fetchUserProfile}
                  mode="password"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setIsPasswordOpen(true);
                }}
                className="block w-full text-left py-2 px-4 hover:bg-gray-200"
              >
                🔒 Change Password
              </button>
              <button
                type="button"
                className="block w-full text-left py-2 px-4 hover:bg-gray-200"
              >
                🌗 Change Theme
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 hover:bg-gray-200"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
