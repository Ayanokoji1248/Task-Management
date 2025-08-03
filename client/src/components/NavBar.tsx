import { BiTask } from "react-icons/bi";

const NavBar = () => {
    return (
        <nav className="max-w-7xl mx-auto p-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center justify-center gap-2">
                <BiTask size={26} />
                <h1 className="text-2xl font-bold">Taskify</h1>
            </div>
            <div className="w-8 h-8 bg-white rounded-full"></div>
        </nav>
    )
}

export default NavBar