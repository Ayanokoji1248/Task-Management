import { FaPlus } from "react-icons/fa6";
import NavBar from "../components/NavBar"
import { BiSearch } from "react-icons/bi";
import { useState } from "react";
import TaskFormModal from "../components/TaskFormModal";
import TaskCard from "../components/TaskCard";


const HomePage = () => {
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="w-full min-h-screen bg-[#0A0A0A]">
            {
                showModal &&
                <div className="w-full h-full bg-zinc-900/80 absolute flex justify-center items-center">
                    <TaskFormModal setShowModal={setShowModal} />
                </div>
            }
            <div className="border-b-2 border-neutral-500">
                <NavBar />
            </div>

            <div className="bg-[#0A0A0A] max-w-7xl mx-auto text-white">
                <div className="w-full h-full flex md:flex-row flex-col py-5">

                    <div className="md:w-[30%] w-full flex flex-col gap-6 rounded-md h-full p-5">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold">My Tasks</h1>
                            <button onClick={() => setShowModal(true)} className="bg-white flex items-center gap-3 text-black font-medium p-2 px-3 rounded-md cursor-pointer"><FaPlus /> New Task</button>
                        </div>

                        <div className="space-y-5">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="search" className="font-medium">Search Task</label>
                                <div className="flex items-center justify-center focus-within:ring-[1px] focus-within:ring-neutral-500 bg-[#121212] gap-2 border-[1px] p-1 px-2 rounded-md border-zinc-600">
                                    <BiSearch size={20} />
                                    <input type="text" className="w-full text-sm p-1 outline-none" placeholder="Search by title or description..." />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="status" className="font-medium">Filter by Status</label>
                                <select name="status" id="status" className="w-fit bg-[#121212] text-sm p-2 rounded-md border-[1px] border-zinc-600">
                                    <option value="" hidden>Select your priority</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="status" className="font-medium">Filter by Status</label>
                                <select name="status" id="status" className="w-fit bg-[#121212] text-sm p-2 rounded-md border-[1px] border-zinc-600">
                                    <option value="" hidden>Select your priority</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="status" className="font-medium">Filter by Status</label>
                                <select name="status" id="status" className="w-fit bg-[#121212] text-sm p-2 rounded-md border-[1px] border-zinc-600">
                                    <option value="" hidden>Select your priority</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>


                        </div>

                        <div className="flex gap-2 justify-evenly flex-wrap">
                            <div className="flex-1 h-28 bg-[#101010] border-[1px] border-zinc-700 rounded-md flex flex-col justify-center items-center ">
                                <h1 className="text-3xl font-bold text-blue-600">1</h1>
                                <p className="text-zinc-400">To Do</p>
                            </div>
                            <div className="flex-1 h-28 bg-[#101010] border-[1px] border-zinc-700 rounded-md flex flex-col justify-center items-center ">
                                <h1 className="text-3xl font-bold text-orange-600">1</h1>
                                <p className="text-zinc-400">In Progress</p>
                            </div>
                            <div className="flex-1 h-28 bg-[#101010] border-[1px] border-zinc-700 rounded-md flex flex-col justify-center items-center ">
                                <h1 className="text-3xl font-bold text-green-600">1</h1>
                                <p className="text-zinc-400">Completed</p>
                            </div>

                        </div>

                    </div>
                    <div className="md:w-[70%] w-full  h-full p-5 flex flex-wrap gap-5">
                        <TaskCard />
                        <TaskCard />
                        <TaskCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage