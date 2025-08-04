import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import { useEffect } from "react"
import useTaskStore from "./store/taskStore"
import axios from "axios"
import { BACKEND_URL } from "./utils"
import ProtectedRoute from "./components/ProtectedRoute"
import useUserStore from "./store/userStore"

const App = () => {

  const { setTask } = useTaskStore();
  const { setUser, setLoading } = useUserStore();

  const getAllTask = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/task/all`, { withCredentials: true });
      setTask(response.data.tasks)
    } catch (error) {
      console.error(error)
    }
  }

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
      await getUser()
      await getAllTask()
    }

    fetchAll();
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