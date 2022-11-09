const createPostPersistance = async (
  postId: string,
  access_token: string,
  text?: string,
  title?: string
) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_REQUEST_URL}/api/posts/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: postId,
          text,
          title,
          token: access_token,
        }),
      }
    );

    const json = await res.json();
    return json;
  } catch (error) {}
};

export default createPostPersistance;
