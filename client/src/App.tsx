import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import { useEffect } from "react"
import axios from "axios"
import { BACKEND_URL } from "./utils"
import ProtectedRoute from "./components/ProtectedRoute"
import useUserStore from "./store/userStore"

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

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App