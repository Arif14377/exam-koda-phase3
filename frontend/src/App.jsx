import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/Landing'
import Dashboard from './pages/Dashboard'
import CreateLink from './pages/CreateLink';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFound';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';

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
      element: <ProtectedRoute element={<Dashboard/>} />
    },
    {
      path: "/links",
      element: <ProtectedRoute element={<CreateLink/>} />
    },
    {
      path: "/profile",
      element: <ProtectedRoute element={<Profile/>}/>
    },
    {
      path: "/not-found",
      element: <NotFoundPage/>
    },
    {
      path: "*",
      element: <NotFoundPage/>
    }
  ])
 
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
