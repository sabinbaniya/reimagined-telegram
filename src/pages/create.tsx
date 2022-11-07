import Layout from "../components/Layout";
import { useState, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import Cookies from "js-cookie";

const Create = () => {
  const [value, setValue] = useState<string | undefined>("");

  const [apiStatus, setApiStatus] = useState({
    loading: false,
    message: "",
    error: "",
  });

  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (val: string | undefined) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      // send request to server as user has finsihed typing
      setApiStatus((prev) => {
        return {
          ...prev,
          loading: true,
        };
      });
      try {
        (async () => {
          console.log(val);
          const res = await fetch(
            "https://blog-app2321.herokuapp.com/api/posts/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: val,
                token: Cookies.get("access_token"),
              }),
            }
          );
          console.log(await res.json());
        })();
      } catch (error) {}
    }, 1000);
    setValue(val);
    // write logic to save the post on users behalf to db
  };

  return (
    <>
      <Layout>
        <h1 className='my-4 text-2xl font-extrabold'>Create a post</h1>
        <p className='text-sm font-medium text-gray-500'>
          First line should begin with # followed by your title and end with #
          as well, that will be set as your post title !
        </p>
        <br />
        <MDEditor value={value} onChange={handleChange} />
        <br />
      </Layout>
    </>
  );
};

export default Create;
