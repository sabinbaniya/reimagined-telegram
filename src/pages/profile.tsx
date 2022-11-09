import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/CurrentUserContext";
import Cookies from "js-cookie";
import { BlogPost } from "../types/Posts";
import { ClipLoader } from "react-spinners";
import reactToText from "react-to-text";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import deletePostInteractor from "../app/deletePostInteractor";
import getUsersPostsInteractor from "../app/getUsersPostsInteractor";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    if (user.state === "loading") return;

    if (user.state === "unauthenticated") return navigate("/");

    (async () => {
      try {
        const json = await getUsersPostsInteractor(Cookies.get("access_token"));
        if (json.success) {
          setPosts(json.data);
        }
        // console.log(json);
      } catch (error) {}
    })();
    //eslint-disable-next-line
  }, [user.state]);

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    e.currentTarget.nextElementSibling?.classList.remove("opacity-0");
    const json = await deletePostInteractor(id, Cookies.get("access_token"));
    if (json.success) {
      setPosts((prev) => {
        const temp = prev?.filter((post) => post._id !== id);
        return temp as BlogPost[];
      });
    }
  };

  return (
    <>
      <Layout>
        <section className='lg:max-w-5xl lg:mx-auto'>
          <div className='flex justify-center items-center w-full'>
            <ClipLoader
              color='#36d7b7'
              loading={!posts}
              size={60}
              className=' mt-8'
            />
          </div>
          {posts && (
            <div className='mt-10'>
              <h1 className='text-3xl font-semibold'>Your Posts</h1>
              <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:max-w-5xl lg:mx-auto'>
                {posts.map((el) => (
                  <Link key={el._id} to={`/posts/${el._id}`}>
                    <div className='bg-gray-800 rounded-2xl p-4 grid grid-rows-4 min-h-[15rem] sm:hover:outline-dashed sm:hover:outline-gray-500 cursor-pointer group items-stretch'>
                      <div>
                        <p className='blog-title h-14 max-h-[64px] text-xl font-semibold'>
                          {el.title}
                        </p>
                      </div>
                      <div className='blog-body grid-row-start-1 row-span-2 max-h-[80px] text-sm text-gray-400'>
                        {reactToText(el.body)}
                      </div>
                      <div className='row-start-4 pt-2 '>
                        <div className='flex justify-between w-full items-end'>
                          <div className='space-y-2'>
                            <div className='flex space-x-2 items-end'>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/create/${el._id}`);
                                }}
                                title='Edit'>
                                <AiFillEdit className='text-xl hover:text-gray-400 transition-all' />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, el._id)}
                                title='Delete'>
                                <AiFillDelete className='text-xl hover:text-red-400 transition-all' />
                              </button>
                              <span className='text-xs text-red-400 opacity-0 transition-all'>
                                Deleting...
                              </span>
                            </div>
                            <div>
                              <div className='text-xs text-gray-400'>
                                {new Date(el.createdAt || "").toDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </Layout>
    </>
  );
};

export default Profile;
