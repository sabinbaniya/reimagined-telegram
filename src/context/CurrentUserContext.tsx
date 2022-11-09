import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import cookie from "js-cookie";

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
  const [user, setUser] = useState({} as User);

  useEffect(() => {
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
