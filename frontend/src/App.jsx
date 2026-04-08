import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/Landing'
import Dashboard from './pages/Dashboard'
import CreateLink from './pages/CreateLink';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage/>
    },
    {
      path: "/register",
      element: <Register/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/dashboard",
      element: <Dashboard/>
    },
    {
      path: "/links",
      element: <CreateLink/>
    },
  ])
 
  return (
    <RouterProvider router={router} />
  )
}

export default App
