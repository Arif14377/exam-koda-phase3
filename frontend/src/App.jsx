import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login'
import Register from './pages/Register'


function App() {

  const router = createBrowserRouter([
    {
      path: "/register",
      element: <Register/>
    },
    {
      path: "/login",
      element: <Login/>
    },
  ])
 
  return (
    <RouterProvider router={router} />
  )
}

export default App
