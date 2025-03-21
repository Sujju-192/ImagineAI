import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHome, FaImage, FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "../Firebase";
import { Link } from "react-router";



const UserNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profilePic = useSelector((state) => state.profilePic); // Get profile picture from Redux
  const name = useSelector((state) => state.name); // Get user's name from Redux
  const navigate = useNavigate()
  const root = useSelector(state => state.rootFolderId);
  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handelSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="https://via.placeholder.com/40"
              alt="Logo"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-xl font-bold text-purple-900 hidden md:block">
              ImaginAI
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-purple-900 hover:text-purple-700"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to={`/user/home/${root}`}>
              <div
                className="flex items-center space-x-2 text-purple-900 hover:text-purple-700 transition-colors"
              >
                <FaHome size={20} />
                <span>Home</span>
              </div>
            </Link>

            <a
              href="#"
              className="flex items-center space-x-2 text-purple-900 hover:text-purple-700 transition-colors"
            >
              <FaImage size={20} />
              <span>Text to Image</span>
            </a>
          </div>


          {/* Profile Dropdown (Desktop) */}
          <div className="hidden md:block relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 text-purple-900 hover:text-purple-700 transition-colors"
            >
              <img
                src={profilePic}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{name}</span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
              >
                <a
                  href="#"
                  className="block px-4 py-2 text-purple-900 hover:bg-purple-100"
                >
                  Settings
                </a>


                <button
                  onClick={handelSignOut}
                  href="#"
                  className="w-full text-left px-4 py-2 text-purple-900 transition-colors duration-100 delay-75 hover:bg-red-600 hover:text-white"
                >
                  Logout
                </button>



              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Menu (Hidden on Desktop) */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-4 pb-4"
          >
            <Link to={`/user/home/${root}`}>
              <div

                className="block px-4 py-2 text-purple-900 hover:bg-purple-100"
              >
                <FaHome size={20} className="inline-block mr-2" />
                Home
              </div>
            </Link>
            <a
              href="#"
              className="block px-4 py-2 text-purple-900 hover:bg-purple-100"
            >
              <FaImage size={20} className="inline-block mr-2" />
              Text to Image
            </a>
            <div className="border-t border-purple-100 mt-2 pt-2">
              <a
                href="#"
                className="block px-4 py-2 text-purple-900 hover:bg-purple-100"
              >
                Settings
              </a>

              <button
                onClick={handelSignOut}
                href="#"
                className="block px-4 py-2 text-purple-900 hover:bg-purple-100"
              >
                Logout
              </button>

            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default UserNavbar;