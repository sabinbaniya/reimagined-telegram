import { Routes, Route } from "react-router-dom";
import Index from "./pages";
import Error from "./pages/404";
import Create from "./pages/create";
import Posts from "./pages/posts";
import Profile from "./pages/profile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Index />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/posts/:id' element={<Posts />}></Route>
        <Route path='/create' element={<Create />}></Route>
        <Route path='/create/:id' element={<Create />}></Route>
        <Route path='*' element={<Error />}></Route>
      </Routes>
    </>
  );
};

export default App;
