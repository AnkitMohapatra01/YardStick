import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AppLayout } from "./Layout/AppLayout";
import { ToastContainer } from "react-toastify";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Success } from "./pages/Success";
import { Error } from "./pages/Error";
const App = () => {
  const user = localStorage.getItem("userId");
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement:<Error/>,
      children: [
        { path: "/", element: user ? <Home /> : <Navigate to="/login" /> },
        { path: "/success", element: user ? <Success /> : <Navigate to="/login" /> },
      ],
    },
    {
      path: "/login",
      element: !user ? <Login /> : <Navigate to="/" />,
    },
  ]);
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
