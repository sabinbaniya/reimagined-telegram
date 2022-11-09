import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import type { BlogPost } from ".";
import { ClipLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useUserContext } from "../context/CurrentUserContext";
import Cookies from "js-cookie";

const Posts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];
  const [post, setPost] = useState<BlogPost | null>(null);
  const { user } = useUserContext();
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_REQUEST_URL}/api/posts/getPostDetail/${postId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: Cookies.get("access_token"),
            }),
          }
        );
        const json: { success: boolean; data: BlogPost | string } =
          await res.json();
        // console.log(json);
        if (json.success === true) {
          if (
            json.data === "Post is private" ||
            json.data === "No post found"
          ) {
            return navigate("/");
          } else {
            document.title = (json.data as BlogPost).title;
            setPost(json.data as BlogPost);
          }
        }
      } catch (error) {}
    })();

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const copyBtn = document?.getElementsByClassName("copied")[0];
    if (!copyBtn) return;
    copyBtn?.addEventListener("click", () => {
      navigator?.clipboard?.writeText(copyBtn.getAttribute("data-code") || "");
    });
  }, [post]);

  return (
    <>
      <Layout>
        <section className='lg:max-w-5xl lg:mx-auto'>
          <div className='flex justify-center items-center w-full'>
            <ClipLoader
              color='#36d7b7'
              loading={!post}
              size={60}
              className=' mt-8'
            />
          </div>
          <div className='pt-8'>
            <h1 className='text-5xl pb-4 leading-[60px]'>{post?.title}</h1>
            <span className='text-gray-500 text-sm font-bold pl-1'>
              {post?.createdAt &&
                "✍️" + new Date(post?.createdAt).toDateString()}
            </span>
            {post && post?.uid === user.data?.uid && (
              <Link to={`/create/${postId}`} className='ml-4 underline'>
                Edit
              </Link>
            )}
            <div className='mt-8 '>
              <MDEditor.Markdown
                className='bg-transparent'
                source={post?.body}
              />
            </div>
            <br />
            <br />
            <br />

            <div className='mt-4 flex justify-start items-center space-x-4'>
              <div>
                <img className='w-12 rounded-lg' src={post?.image} alt='' />
              </div>
              <div>
                {post?.name}
                <div className='mt-2 text-xs'>
                  {post?.createdAt !== post?.updatedAt
                    ? "Last Updated on " +
                      (post?.updatedAt &&
                        new Date(post?.updatedAt).toLocaleString())
                    : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Posts;
