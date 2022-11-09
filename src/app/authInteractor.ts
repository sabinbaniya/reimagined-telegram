const authInteractor = async (code: string) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_REQUEST_URL}/api/auth/github`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }
    );
    const json = await res.json();
    return json;
  } catch (error) {}
};

export default authInteractor;
