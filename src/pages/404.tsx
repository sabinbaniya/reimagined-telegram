import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className='h-screen w-screen grid place-items-center textr-3xl font-bold'>
      <span>
        404 not found | <Link to='/'>Go home</Link>
      </span>
    </div>
  );
};

export default Error;
