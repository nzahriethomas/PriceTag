import { Link } from "react-router";
import primaryLogo from "../assets/pricetag-logo.png";
import { ImHome } from "react-icons/im";
import { FaUserAlt } from "react-icons/fa";

export const Navbar = () => {
  return (
    // Container
    <nav className="max-h-[85px] flex items-center justify-between fixed top-0 bg-sky-400 shadow-lg w-full">
      <div className="flex items-center gap-2 py-3 px-4">
        {/* Logo & Core Nav - Left */}
        <Link to="/">
          <img
            src={primaryLogo}
            alt="PriceTag Logo"
            className=" h-[85px] w-auto"
          />
        </Link>
        <Link
          to="/"
          className="py-2 px-4 md:text-lg text-white hover:text-sky-300 rounded-2xl transition duration-300"
        >
          <ImHome className="md:h-[30px] md:w-auto" />
        </Link>
        <Link
          to="/profile"
          className="py-2 px-4 md:text-lg text-white hover:text-sky-300 rounded-2xl transition duration-300"
        >
          <FaUserAlt className="md:h-[25px] md:w-auto" />
        </Link>
      </div>

      {/* Search bar / Filter */}
      <div className="flex items-center py-3 px-4"></div>

      {/* Authentication Actions - Right */}
      <div className="flex items-center py-3 px-4">
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
      </div>
    </nav>
  );
};
