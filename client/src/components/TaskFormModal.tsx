import { RxCross2 } from "react-icons/rx";
import { BACKEND_URL } from "../utils";
import axios from "axios";
import { useState } from "react";
import useTaskStore from "../store/taskStore";

interface TaskFormModalProp {
    setShowModal: (show: boolean) => void
}

const TaskFormModal = ({ setShowModal }: TaskFormModalProp) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");

    const { addTask } = useTaskStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${BACKEND_URL}/task/create`, {
                title,
                description,
                status,
                priority
            }, { withCredentials: true });

            console.log(response.data)
            addTask(response.data.task)

            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    }

    return (

        <div className="w-full max-w-md p-6 bg-white border border-zinc-200 rounded-lg shadow-sm md:p-6 dark:bg-[#0a0a0a] dark:border-zinc-800">
            <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                <div className="flex items-center justify-between">
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white">Create new task</h5>
                    <button type="button" onClick={() => setShowModal(false)} className="text-white cursor-pointer"><RxCross2 size={22} />
                    </button>
                </div>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="title" name="title" id="title" className="bg-[#121212] border-[1px] border-zinc-800 text-white text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400 focus-within:ring-[1px] focus-within:ring-zinc-700 outline-none" placeholder="Enter task title" required />
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} name="description" id="description" className="bg-[#121212] border-[1px] border-zinc-800 text-white text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400 focus-within:ring-[1px] focus-within:ring-zinc-700 outline-none resize-none" placeholder="Enter task description" required></textarea>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                        <select onChange={(e) => setStatus(e.target.value)} name="status" id="status" className="w-fit bg-[#121212] text-sm p-2 rounded-md border-[1px] border-zinc-600 text-zinc-400">
                            <option value="" hidden>Select your status</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Priority</label>
                        <select onChange={(e) => setPriority(e.target.value)} name="status" id="status" className="w-fit bg-[#121212] text-sm p-2 rounded-md border-[1px] border-zinc-600 text-zinc-400">
                            <option value="" hidden>Select your priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="w-full text-black bg-white hover:bg-neutral-300 focus:ring-2 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer transition-all duration-300">Create Task</button>

            </form>
        </div>

    )
}

export default TaskFormModal