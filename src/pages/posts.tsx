import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import type { BlogPost } from ".";
import { ClipLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";

const Posts = () => {
  const location = useLocation();
  const postId = location.pathname.split("/")[2];
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${process.env.REACT_APP_REQUEST_URL}/api/posts/getPostDetail/${postId}`
      );
      const json: { success: boolean; data: BlogPost } = await res.json();
      console.log(json);
      if (json.success === true) {
        setPost(json.data);
      }
    })();

    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Layout>
        <section className='lg:max-w-5xl lg:mx-auto'>
          <div className='flex justify-center items-center w-full'>
            <ClipLoader color='#36d7b7' loading={!post} size={60} />
          </div>
          <div className='pt-8'>
            <h1 className='text-5xl pb-4'>{post?.title}</h1>
            <span className='text-gray-500 text-sm font-bold pl-1'>
              ✍️ {new Date(post?.createdAt || "").toDateString()}
            </span>
            <div className='mt-8 '>
              <MDEditor.Markdown
                className='bg-transparent'
                source={post?.body}
              />
            </div>
            <div className='mt-4'>
              {(post?.__v || 0) > 0
                ? "Last Updated on " +
                  new Date(post?.updatedAt || "").toLocaleString()
                : null}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Posts;
