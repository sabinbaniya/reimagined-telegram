const getPostDetail = async (postId: string, access_token: string) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_REQUEST_URL}/api/posts/create/getPostDetail/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: access_token,
        }),
      }
    );
    const json = await res.json();
    return json;
  } catch (error) {}
};

export default getPostDetail;
