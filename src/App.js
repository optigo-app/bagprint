import { RouterProvider, useLocation } from 'react-router-dom';
import './App.css';
import { router } from "./Routes/Route"
import queryString from 'query-string';
function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
