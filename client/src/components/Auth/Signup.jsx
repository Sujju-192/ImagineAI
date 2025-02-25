import React, { useState } from "react";
import { useFirebase } from "../../Firebase";
import { Link } from "react-router";
import { createUserAtServer } from "../../API/user.api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  const firebase = useFirebase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    const res = await firebase.signup(email, password);


    if (res) {
      const status = await createUserAtServer(res);
      if (status > 300) {
        setErrorMessage("Failed to create an account. Please try again.");
      }
    }
    else {
      setErrorMessage("Failed to create an account. Please try again.");
    }

  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const res = await firebase.signinByGoogle();

    if (res) {
      const status = await createUserAtServer(res);
      if (status > 300) {
        setErrorMessage("Failed to create an account. Please try again.");
      }
    }
    else {
      setErrorMessage("Failed to create an account. Please try again.");
    }

    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-indigo-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
          Create Your Account
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Error Message Display */}
        {errorMessage.length > 0 && (
          <p className="text-red-600 text-sm mb-4 text-center">{errorMessage}</p>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-purple-900 text-white py-2 px-4 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Sign Up
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={handleGoogleAuth}
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Logo"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to={"/login"} className="text-purple-900 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
