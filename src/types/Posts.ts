export interface BlogPost {
  body: string;
  createdAt: string;
  image: string;
  name: string;
  title: string;
  uid: number;
  updatedAt: string;
  _id: string;
  __v: number;
  visibility: "private" | "public";
}

export interface UpdateBlogPost {
  _id: string;
  token: string;
  privateVisibilty?: boolean;
  title?: string;
  text?: string;
}
