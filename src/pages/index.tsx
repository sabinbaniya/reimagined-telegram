import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";

interface BlogPost {
  body: string;
  createdAt: string;
  image: string;
  name: string;
  title: string;
  uid: number;
  updatedAt: string;
  _id: string;
}

const respons = {
  success: true,
  data: [
    {
      _id: "636938317ac911b89f5f4ca9",
      title: " Title ",
      uid: 84828938,
      body: "# Title #\nBlog 1 blog2 ",
      image: "https://avatars.githubusercontent.com/u/84828938?v=4",
      name: "Sabin Baniya",
      createdAt: "2022-11-07T16:54:09.946Z",
      updatedAt: "2022-11-07T16:54:09.946Z",
      __v: 0,
    },
    {
      _id: "636938607ac911b89f5f4cac",
      title: " My Blog ",
      uid: 84828938,
      body: "# My Blog #\nHi guys",
      image: "https://avatars.githubusercontent.com/u/84828938?v=4",
      name: "Sabin Baniya",
      createdAt: "2022-11-07T16:54:56.964Z",
      updatedAt: "2022-11-07T16:54:56.964Z",
      __v: 0,
    },
  ],
};

const Index = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    (async () => {
      console.log("first");
      const res = await fetch(
        "https://blog-app2321.herokuapp.com/api/posts/getAllPosts"
      );
      const json: { success: boolean; data: BlogPost[] } = await res.json();
      setBlogPosts(json.data);
      // setBlogPosts(respons.data);
      console.log(json);
    })();
  }, []);

  return (
    <>
      <Layout>
        <p className='text-center my-6 text-2xl font-black'>Lastest Writes</p>
        <div className='flex flex-wrap justify-start items-center gap-4'>
          {respons.data?.map((el) => (
            <div className='bg-gray-800 rounded-tr-2xl rounded-bl-2xl rounded-sm p-4 grid grid-rows-2 '>
              <div className='overflow-hidden text-ellipsis '>
                <MDEditor.Markdown
                  source={el.body}
                  style={{ background: "transparent" }}
                />
              </div>
              <div className='row-start-2 pt-2 justify-self-end'>
                <div className='flex justify-center items-end space-x-2'>
                  <img src={el.image} alt='' className='w-10 rounded-md' />
                  <div>
                    <p>{el.title}</p>
                    <p>{el.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </>
  );
};

export default Index;
