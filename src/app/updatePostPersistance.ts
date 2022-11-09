import { UpdateBlogPost } from "../types/Posts";

const updatePostPersistance = async (
  postId: string,
  access_token: string,
  privateVisibility?: boolean,
  title?: string,
  text?: string
) => {
  try {
    const bodyToSend: UpdateBlogPost = {
      _id: postId,
      token: access_token,
    };

    if (typeof privateVisibility !== "undefined")
      bodyToSend["privateVisibilty"] = !privateVisibility;
    if (typeof title !== "undefined") bodyToSend["title"] = title;
    if (typeof text !== "undefined") bodyToSend["text"] = text;

    const res = await fetch(
      `${process.env.REACT_APP_REQUEST_URL}/api/posts/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToSend),
      }
    );

    const json = await res.json();
    return json;
  } catch (error) {}
};

export default updatePostPersistance;
