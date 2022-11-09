import type { Dispatch, SetStateAction } from "react";

export interface UserData {
  github_join_date: string;
  iat: number;
  image: string;
  name: string;
  uid: number;
}

export interface User {
  data: null | UserData;
  state: "loading" | "authenticated" | "unauthenticated";
}

export interface UserContext {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}
