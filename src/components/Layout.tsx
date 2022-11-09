import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import { useUserContext } from "../context/CurrentUserContext";
import Cookies from "js-cookie";

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [dropdownActive, setDropdownActive] = useState(false);
  const { user, setUser } = useUserContext();
  const handleGithubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&redirect_uri=${window.location.href}`;
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    setUser({
      data: null,
      state: "unauthenticated",
    });
  };

  return (
    <section className='px-4 relative'>
      <div
        onClick={() => setDropdownActive(false)}
        className={`absolute inset-0 z-20 ${
          dropdownActive ? "block" : "hidden"
        }`}></div>
      <nav className='flex h-20 items-center justify-between border-b-[0.2px] border-b-gray-500 fixed w-[calc(100vw-34px)] backdrop-blur-sm z-20 lg:max-w-5xl lg:left-1/2 lg:-translate-x-1/2'>
        <Link to='/' className='text-3xl font-black'>
          Blog {location.pathname.endsWith("create") && " | Create"}
        </Link>
        {user.state !== "authenticated" ? (
          <button
            onClick={() =>
              user.state === "loading" ? null : handleGithubLogin()
            }
            className={`${
              user.state === "loading" ? "opacity-50 pointer-events-none" : ""
            } bg-gray-300 text-gray-800 px-6 rounded-full flex items-center py-2 hover:bg-indigo-200 transition-all`}>
            {user.state === "loading" ? (
              "Signing in..."
            ) : (
              <>
                Continue w/ Github <FaGithub className='ml-4 text-2xl' />
              </>
            )}
          </button>
        ) : (
          <div className='flex items-center space-x-2'>
            <button
              onClick={() => setDropdownActive((prev) => !prev)}
              className='relative focus:outline-none bg-gray-300 text-gray-800 pr-6 pl-2 rounded-full flex items-center py-2 hover:bg-indigo-200 transition-all'>
              <img
                src={user?.data?.image}
                alt=''
                className='w-7 rounded-full mr-2'
              />
              {user?.data?.name}
              <span
                className={`absolute origin-top transition-all z-30 flex flex-col bg-slate-900 shadow-gray-700 shadow-lg top-16 right-0 w-full py-2 mt-1 rounded-lg ${
                  dropdownActive ? "scale-y-1" : "scale-y-0"
                }`}>
                <Link
                  to='/profile'
                  className='px-8 py-2 text-gray-200 hover:bg-gray-800 transition-all'>
                  Profile
                </Link>
                <Link
                  to='/create'
                  className='px-8 py-2 text-gray-200 hover:bg-gray-800 transition-all'>
                  Create
                </Link>
                <span
                  onClick={() => handleLogout()}
                  className='px-8 py-2 text-gray-200 hover:bg-gray-800 transition-all'>
                  Logout
                </span>
              </span>
            </button>
            <Link to='/create'>
              <IoCreate className='text-3xl' />
            </Link>
          </div>
        )}
      </nav>
      <main className='py-20 overflow-x-hidden min-h-screen relative'>
        {children}
      </main>
    </section>
  );
};

export default Layout;
