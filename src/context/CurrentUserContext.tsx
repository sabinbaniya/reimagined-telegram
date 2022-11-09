import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { User, UserContext } from "../types/User";
import parseJwt from "../helpers/parseJwt";
import authInteractor from "../app/authInteractor";

const userContext = createContext({} as UserContext);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({ data: null, state: "loading" });

  const code = window.location.href.split("code=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      (async () => {
        try {
          const json = await authInteractor(code);
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
