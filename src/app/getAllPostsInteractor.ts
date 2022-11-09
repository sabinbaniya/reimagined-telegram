const getAllPostsInteractor = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_REQUEST_URL}/api/posts/getAllPosts?page=${page}`
    );
    const json = await res.json();
    return json;
  } catch (error) {}
};
export default getAllPostsInteractor;
