import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import { useEffect } from "react"
import axios from "axios"
import { BACKEND_URL } from "./utils"
import ProtectedRoute from "./components/ProtectedRoute"
import useUserStore from "./store/userStore"
import Dashboard from "./pages/Dashboard"
import AdminAuthPage from "./pages/AdminAuthPage"

const App = () => {

  const { setUser, setLoading } = useUserStore();

  const getUser = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${BACKEND_URL}/user/me`, { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        await getUser();
      } catch (error) {
        console.error(error)
      }
      finally {
        setLoading(false)
      }
    }

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/admin" element={<AdminAuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App