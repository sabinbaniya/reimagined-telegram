const deletePostInteractor = async (
  id: string,
  access_token: string | undefined
) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_REQUEST_URL}/api/posts/deletePost/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: id,
          token: access_token,
        }),
      }
    );

    const json = await res.json();
    return json;
  } catch (error) {
    return error;
  }
};

export default deletePostInteractor;
