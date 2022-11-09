import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import { useUserContext } from "../context/CurrentUserContext";

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user } = useUserContext();
  const handleGithubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=ba8afc4a26d4e6d97c96&redirect_uri=${window.location.href}`;
  };
  return (
    <section className='px-4 relative'>
      <nav className='flex h-20 items-center justify-between border-b-[0.2px] border-b-gray-500 fixed w-[calc(100vw-34px)] backdrop-blur-sm z-20 lg:max-w-5xl lg:left-1/2 lg:-translate-x-1/2'>
        <Link to='/' className='text-3xl font-black'>
          Blog {location.pathname.endsWith("create") && " | Create"}
        </Link>
        {user.state !== "authenticated" ? (
          <button
            onClick={() => handleGithubLogin()}
            className='bg-gray-300 text-gray-800 px-6 rounded-full flex items-center py-2 hover:bg-indigo-200 transition-all'>
            Continue w/ Github <FaGithub className='ml-4 text-2xl' />
          </button>
        ) : (
          <div className='flex items-center space-x-2'>
            <button className='bg-gray-300 text-gray-800 pr-6 pl-4 rounded-full flex items-center py-2 hover:bg-indigo-200 transition-all'>
              <img
                src={user?.data?.image}
                alt=''
                className='w-6 rounded-full mr-2'
              />
              {user?.data?.name}
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
