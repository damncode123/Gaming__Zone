import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import img1 from '../Assests/img1.png';

const Navbar = () => {
  // Retrieve logged-in user information from local storage
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open); // Toggle the open state
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/games/login'; // You can use this method or your preferred routing method
  };

  return (
    <div>
      <nav className="bg-white border-gray-400 dark:bg-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center space-x-5 rtl:space-x-reverse">
            <img src={img1} className="h-10" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">GamingZone</span>
          </Link>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
            onClick={handleOpen} // Add onClick handler to toggle the dropdown
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-11 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-700 dark:border-gray-700">
              <li>
                <Link to="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" aria-current="page">Home</Link>
              </li>
              {loggedInUser && (
                <li>
                  <Link to="/games" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Games</Link>
                </li>
              )}
              <li>
                <Link to="/about" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</Link>
              </li>
              {loggedInUser ? (
                <li className="flex items-center space-x-2">
                  <div className="relative">
                    <img onClick={handleOpen} src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?t=st=1714162363~exp=1714165963~hmac=bc1e37fcd8e283a514589246514a078b0ecb2c25bd896088efb909931f4fe8ae&w=740" className="h-8 w-8 rounded-full cursor-pointer" alt="Profile" />
                    {open && (
                      <ul className="absolute top-10 right-0 bg-white border border-gray-200 rounded-md shadow-lg">
                        <li>
                          <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Logout</button>
                        </li>
                      </ul>
                    )}
                  </div>
                  <span className="text-white">{loggedInUser.username}</span>
                </li>
              ) : (
                <li>
                  <Link to="/games/login" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
