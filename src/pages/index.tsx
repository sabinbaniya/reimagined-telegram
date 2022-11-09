import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import reactToText from "react-to-text";
import { Link } from "react-router-dom";

export interface BlogPost {
  body: string;
  createdAt: string;
  image: string;
  name: string;
  title: string;
  uid: number;
  updatedAt: string;
  _id: string;
  __v: number;
  visibility: "private" | "public";
}

const Index = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[] | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    hasMore: true,
  });

  document.title = "Latest Blogs from Everyone 🌍";

  useEffect(() => {
    setBlogPosts(null);
    (async () => {
      const res = await fetch(
        `${process.env.REACT_APP_REQUEST_URL}/api/posts/getAllPosts?page=${pagination.page}`
      );
      const json: { success: boolean; data: BlogPost[] } = await res.json();
      if (json.data.length === 0) {
        setPagination((prev) => {
          return {
            ...prev,
            hasMore: false,
          };
        });
      } else {
        setPagination((prev) => {
          return {
            ...prev,
            hasMore: true,
          };
        });
      }
      setBlogPosts(json.data);
    })();
  }, [pagination.page]);

  return (
    <>
      <Layout>
        <p className='text-center my-6 text-2xl font-black'>Lastest Writes</p>
        <div className='flex justify-center items-center w-full'>
          <ClipLoader color='#36d7b7' loading={!blogPosts} size={60} />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:max-w-5xl lg:mx-auto'>
          {!pagination.hasMore && (
            <h3 className='text-xl font-medium text-center col-span-full my-4'>
              You have reached the end 📖
            </h3>
          )}
          {blogPosts?.map((el) => (
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
                    <div className='flex items-end space-x-2'>
                      <img src={el.image} alt='' className='w-10 rounded-md' />
                      <div>
                        <p>{el.name}</p>
                        <div className='text-xs text-gray-500'>
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
        <div className='pt-8'>
          <div className='absolute bottom-10 flex justify-between items-center w-full lg:max-w-5xl lg:left-1/2 lg:-translate-x-1/2 px-0.5'>
            <button
              className={`bg-slate-800 relative px-4 py-2 rounded-md font-medium group focus:outline-gray-400 focus:outline-dashed ${
                pagination.page > 0 ? "" : "opacity-50 pointer-events-none"
              }`}
              onClick={() =>
                pagination.page > 0
                  ? setPagination((prev) => {
                      return { ...prev, page: prev.page - 1 };
                    })
                  : null
              }>
              <span className='absolute left-4 group group-hover:left-3 transition-all top-1/2 -translate-y-1/2'>
                &lt;
              </span>
              <span className='pl-4'>Prev</span>
            </button>
            <button
              className={`bg-slate-800 relative px-4 py-2 rounded-md font-medium group focus:outline-gray-400 focus:outline-dashed ${
                pagination.hasMore ? "" : "opacity-50 pointer-events-none"
              }`}
              onClick={() =>
                pagination.hasMore
                  ? setPagination((prev) => {
                      return { ...prev, page: prev.page + 1 };
                    })
                  : null
              }>
              <span className='pr-4'>Next</span>
              <span className='absolute right-4 group group-hover:right-3 transition-all top-1/2 -translate-y-1/2'>
                &gt;
              </span>
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
