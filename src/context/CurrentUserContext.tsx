import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import cookie from "js-cookie";
import { useNavigate } from "react-router-dom";

interface UserData {
  github_join_date: string;
  iat: number;
  image: string;
  name: string;
  uid: number;
}
interface User {
  data: null | UserData;
  state: "loading" | "authenticated" | "unauthenticated";
}

interface UserContext {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const userContext = createContext({} as UserContext);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({ data: null, state: "loading" });

  const code = window.location.href.split("code=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      (async () => {
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
          if (json.status === "success") {
            setUser((prev) => {
              return {
                data: { ...parseJwt(json.cookie) },
                state: "authenticated",
              };
            });
            document.cookie = json.cookie;
            navigate("/");
            return;
          }
          setUser({ data: null, state: "unauthenticated" });
          // console.log(json);
        } catch (error) {
          setUser({ data: null, state: "unauthenticated" });
        }
      })();
    } else {
      const res = cookie.get("access_token");
      if (res) {
        const details = parseJwt(res);
        if (details) {
          return setUser({ data: details, state: "authenticated" });
        } else {
          return setUser({ data: details, state: "unauthenticated" });
        }
      }
      setUser({ data: null, state: "unauthenticated" });
    }
    //eslint-disable-next-line
  }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};

const useUserContext = () => useContext(userContext);

export { useUserContext };
export default UserContextProvider;
