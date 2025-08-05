import axios from "axios";
import { BiTask } from "react-icons/bi";
import { BACKEND_URL } from "../utils";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate()

    const logout = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
            console.log(response.data)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <nav className="max-w-7xl mx-auto p-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center justify-center gap-2">
                <BiTask size={26} />
                <h1 className="text-2xl font-bold">Taskify</h1>
            </div>
            <div>
                <button onClick={logout} className="p-2 py-1 rounded-md text-sm font-medium bg-red-500 cursor-pointer">Logout</button>
            </div>
        </nav>
    )
}

export default NavBar