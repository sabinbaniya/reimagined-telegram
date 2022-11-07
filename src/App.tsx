import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "./context/CurrentUserContext";
import Index from "./pages";
import Error from "./pages/404";
import Create from "./pages/create";
import { parseJwt } from "./context/CurrentUserContext";

const App = () => {
  const code = window.location.href.split("code=")[1];
  const { setUser } = useUserContext();

  useEffect(() => {
    if (code) {
      setUser((prev) => {
        return {
          ...prev,
          state: "loading",
        };
      });
      (async () => {
        try {
          const res = await fetch(
            "https://blog-app2321.herokuapp.com/api/auth/github",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code }),
            }
          );
          const json = await res.json();
          if (json.status === "success") {
            setUser((prev) => {
              return {
                ...parseJwt(json.cookie),
                state: "authenticated",
              };
            });
            document.cookie = json.cookie;
            return;
          }
          setUser({ data: null, state: "unauthenticated" });
          console.log(json);
        } catch (error) {
          setUser({ data: null, state: "unauthenticated" });
        }
      })();
    }

    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Routes>
        <Route path='/' element={<Index />}></Route>
        <Route path='/create' element={<Create />}></Route>
        <Route path='*' element={<Error />}></Route>
      </Routes>
    </>
  );
};

export default App;
