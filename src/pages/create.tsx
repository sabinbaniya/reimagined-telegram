import Layout from "../components/Layout";
import { useState, useRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import Cookies from "js-cookie";
import { useUserContext } from "../context/CurrentUserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { BlogPost } from ".";
import { ClipLoader } from "react-spinners";

const Create = () => {
  const [value, setValue] = useState<string | undefined>();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const titleInputRef = useRef<HTMLSpanElement | null>(null);
  const [postId, setPostId] = useState(location.pathname.split("/")[2]);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [privateVisibility, setprivateVisibility] = useState({
    data: true,
    loading: true,
  });

  const [apiStatus, setApiStatus] = useState("");

  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (val: string | undefined) => {
    // console.log(val);
    if (titleInputRef?.current?.innerText === "Give it a title") {
      setApiStatus("Give it a title to save");
      return setValue(val);
    }

    // clear previous timer, thishelps in creating debouncing
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setApiStatus("Saving...");
      // send request to server as user has finsihed typing
      try {
        (async () => {
          console.log(val);
          let res;
          if (!postId) {
            res = await fetch(
              `${process.env.REACT_APP_REQUEST_URL}/api/posts/create`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  _id: postId,
                  text: val,
                  title: titleInputRef.current?.innerText,
                  token: Cookies.get("access_token"),
                }),
              }
            );
          } else {
            res = await fetch(
              `${process.env.REACT_APP_REQUEST_URL}/api/posts/update`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  _id: postId,
                  text: val,
                  token: Cookies.get("access_token"),
                }),
              }
            );
          }

          const json = await res.json();
          if (json.success) {
            setApiStatus("Saved");
            if (json.created) {
              setApiStatus("New post created successfully");
              setPostId(json.data._id);
              navigate(`./${json.data._id}`);
            }
          } else {
            setApiStatus("Error Occured, When trying to save");
          }
          setTimeout(() => {
            setApiStatus("");
          }, 2000);
        })();
      } catch (error) {
        console.log(error);
        setApiStatus("Error Occured, When trying to save");
        setTimeout(() => {
          setApiStatus("");
        }, 2000);
      }
    }, 1000);

    setValue(val);
  };

  const handleTitleChange = () => {
    if (!postId) return;
    // console.log("first");
    if (titleInputRef?.current?.innerText === "Give it a title") {
      return setApiStatus("Give it a title to save");
    }

    // clear previous timer, thishelps in creating debouncing
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setApiStatus("Saving...");
      // send request to server as user has finsihed typing
      (async () => {
        // console.log(val);
        try {
          const res = await fetch(
            `${process.env.REACT_APP_REQUEST_URL}/api/posts/update`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                _id: postId,
                title: titleInputRef.current?.innerText || "No title",
                token: Cookies.get("access_token"),
              }),
            }
          );

          const json = await res.json();
          if (json.success) {
            setApiStatus("Saved");
          } else {
            setApiStatus("Error Occured, When trying to save");
          }
          setTimeout(() => {
            setApiStatus("");
          }, 2000);
        } catch (error) {
          console.log(error);
          setApiStatus("Error Occured, When trying to save");
          setTimeout(() => {
            setApiStatus("");
          }, 2000);
        }
      })();
    }, 1000);
  };

  const handleVisibiltyChange = () => {
    setprivateVisibility((prev) => {
      return {
        ...prev,
        loading: true,
      };
    });

    if (titleInputRef?.current?.innerText === "Give it a title") {
      return setApiStatus("Give it a title to save");
    }

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setApiStatus("Saving...");

      try {
        (async () => {
          // console.log(val);
          const res = await fetch(
            `${process.env.REACT_APP_REQUEST_URL}/api/posts/update`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                _id: postId,
                privateVisibility: !privateVisibility.data,
                token: Cookies.get("access_token"),
              }),
            }
          );

          const json = await res.json();
          if (json.success) {
            if (json.data.visibility === privateVisibility.data) {
              setApiStatus("Error Occured, When trying to save");
            } else {
              setApiStatus("Saved");
            }
          } else {
            setApiStatus("Error Occured, When trying to save");
          }

          setprivateVisibility((prev) => {
            return {
              data: json.data.visibility === "private" ? true : false,
              loading: false,
            };
          });

          setTimeout(() => {
            setApiStatus("");
          }, 2000);
        })();
      } catch (error) {
        // console.log(error);
        setprivateVisibility((prev) => {
          return {
            ...prev,
            loading: false,
          };
        });
        setApiStatus("Error Occured, When trying to save");
        setTimeout(() => {
          setApiStatus("");
        }, 2000);
      }
    }, 500);
  };

  useEffect(() => {
    if (user.state === "loading") return;

    if (user.state === "unauthenticated") return navigate("/");

    document.title = "Create | Blog";

    const postId = location.pathname.split("/")[2];

    if (postId?.length === 24 && !post) {
      (async () => {
        try {
          console.log("called");
          const res = await fetch(
            `${process.env.REACT_APP_REQUEST_URL}/api/posts/create/getPostDetail/${postId}`,
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
          console.log(json);
          if (json.success === true) {
            if (json.data === "Post is private") {
              return navigate("/");
            }
            document.title = (json.data as BlogPost).title;
            setPost(json.data as BlogPost);
            setValue((json.data as BlogPost).body);
            // setprivateVisibility(() =>
            //   json.data.visibility === "private" ? true : false
            // );
            setprivateVisibility((prev) => {
              return {
                data:
                  (json.data as BlogPost).visibility === "private"
                    ? true
                    : false,
                loading: false,
              };
            });
            if (titleInputRef.current)
              titleInputRef.current.innerText = (json.data as BlogPost).title;
          }
        } catch (error) {}
      })();
    }

    //eslint-disable-next-line
  }, [user.state]);

  return (
    <>
      <Layout>
        <section className='lg:max-w-5xl lg:mx-auto pt-10'>
          <div className='flex justify-center items-center w-full'>
            <ClipLoader
              color='#36d7b7'
              loading={postId?.length === 24 && !post}
              size={60}
              className=' mt-8'
            />
          </div>
          {!(postId?.length === 24 && !post) && (
            <>
              <div>
                <span
                  ref={titleInputRef}
                  onFocus={(e) => {
                    if (e.target.innerText === "Give it a title") {
                      e.target.innerText = "";
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.innerText === "") {
                      e.target.innerText = "Give it a title";
                    } else {
                      handleTitleChange();
                    }
                  }}
                  role={"textbox"}
                  contentEditable
                  suppressContentEditableWarning={true}
                  className='inline-block min-w-[150px] focus:outline focus:outline-gray-400 bg-transparent py-1 focus:outline-none rounded-md ml-1 text-4xl focus:text-base transition-all focus:px-4'>
                  Give it a title
                </span>
              </div>
              <br />
              <MDEditor
                height={400}
                value={value}
                onChange={handleChange}></MDEditor>
              <div className='text-sm my-4 text-gray-300 flex items-center'>
                <p className='min-w-[60px]'>
                  {privateVisibility.data ? "Private" : "Public"}
                </p>
                <button
                  onClick={() => {
                    handleVisibiltyChange();
                  }}
                  className={`w-10 focus:outline-none transition-all h-6 bg-gray-100 px-0.5 rounded-full inline-flex items-center ${
                    privateVisibility.data ? "justify-end" : "justify-start"
                  } ${
                    !privateVisibility.loading
                      ? ""
                      : "opacity-50 pointer-events-none"
                  }`}>
                  <span className='bg-blue-500 w-5 h-5 block rounded-full transition-all'></span>
                </button>
              </div>
              <br />
              <div>{apiStatus}</div>
            </>
          )}
        </section>
      </Layout>
    </>
  );
};

export default Create;
