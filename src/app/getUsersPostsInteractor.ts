const getUsersPostsInteractor = async (access_token?: string) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_REQUEST_URL}/api/posts/getUsersPosts`,
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
    // console.log(json);
  } catch (error) {}
};

export default getUsersPostsInteractor;
