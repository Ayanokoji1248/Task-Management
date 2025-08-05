import { FaPlus } from "react-icons/fa6";
import NavBar from "../components/NavBar";
import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";
import TaskFormModal from "../components/TaskFormModal";
import TaskCard from "../components/TaskCard";
import useTaskStore from "../store/taskStore";
import { BACKEND_URL } from "../utils";
import axios from "axios";

const HomePage = () => {
    const { tasks, setTask, tasksCount } = useTaskStore();

    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("");

    const { todo, inProgress, completed } = tasksCount();

    const getAllTask = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/task/all`, { withCredentials: true });
            setTask(response.data.tasks.reverse());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllTask();
    }, []);

    const filteredAndSortedTasks = tasks
        .filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (!sortBy) return 0;
            if (sortBy === "createdAt") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return a[sortBy].localeCompare(b[sortBy]);
        });

    return (
        <div className="w-full min-h-screen bg-[#0A0A0A]">
            {showModal && (
                <div className="w-full h-full bg-zinc-900/80 fixed flex justify-center items-center z-50">
                    <TaskFormModal setShowModal={setShowModal} />
                </div>
            )}

            <div className="border-b-2 border-neutral-500">
                <NavBar />
            </div>

            <div className="bg-[#0A0A0A] max-w-7xl mx-auto text-white">
                <div className="w-full h-full flex md:flex-row flex-col py-5">
                    {/* Sidebar */}
                    <div className="md:w-[30%] w-full flex flex-col gap-6 rounded-md h-full p-5">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold">My Tasks</h1>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-white flex items-center gap-3 text-black font-medium p-2 px-3 rounded-md cursor-pointer"
                            >
                                <FaPlus /> New Task
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Search */}
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">Search Task</label>
                                <div className="flex items-center focus-within:ring-[1px] focus-within:ring-neutral-500 bg-[#121212] gap-2 border-[1px] p-1 px-2 rounded-md border-zinc-600">
                                    <BiSearch size={20} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full text-sm p-1 outline-none bg-transparent"
                                        placeholder="Search by title or description..."
                                    />
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-fit bg-[#121212] text-sm p-2 rounded-md border-[1px] border-zinc-600"
                                >
                                    <option value="">None</option>
                                    <option value="status">Status</option>
                                    <option value="priority">Priority</option>
                                    <option value="createdAt">Created Date</option>
                                </select>
                            </div>
                        </div>

                        {/* Task Stats */}
                        <div className="flex gap-2 justify-evenly flex-wrap">
                            <div className="flex-1 h-28 bg-[#101010] border-[1px] border-zinc-700 rounded-md flex flex-col justify-center items-center ">
                                <h1 className="text-3xl font-bold text-blue-600">{todo}</h1>
                                <p className="text-zinc-400">To Do</p>
                            </div>
                            <div className="flex-1 h-28 bg-[#101010] border-[1px] border-zinc-700 rounded-md flex flex-col justify-center items-center ">
                                <h1 className="text-3xl font-bold text-orange-600">{inProgress}</h1>
                                <p className="text-zinc-400">In Progress</p>
                            </div>
                            <div className="flex-1 h-28 bg-[#101010] border-[1px] border-zinc-700 rounded-md flex flex-col justify-center items-center ">
                                <h1 className="text-3xl font-bold text-green-600">{completed}</h1>
                                <p className="text-zinc-400">Completed</p>
                            </div>
                        </div>
                    </div>

                    {/* Tasks List */}
                    <div className="md:w-[70%] w-full h-full p-5 flex flex-wrap gap-5">
                        {filteredAndSortedTasks.length === 0 ? (
                            <div className="w-full flex justify-center items-center">
                                <p className="font-medium text-zinc-500">No tasks match your search/sort.</p>
                            </div>
                        ) : (
                            filteredAndSortedTasks.map((task) => (
                                <TaskCard key={task._id} {...task} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
