import { BsClock, BsTrash } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import type taskProp from "../interfaces/taskInterface";
import { BACKEND_URL } from "../utils";
import axios from "axios";
import useTaskStore from "../store/taskStore";

const TaskCard = ({ _id, title, description, status, priority, createdAt, updatedAt }: taskProp) => {
    const { updateTask, deleteTask } = useTaskStore();

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    const getNextStatus = (current: string) => {
        if (current === "To Do") return "In Progress";
        if (current === "In Progress") return "Completed";
        return "To Do";
    };

    const handleStatusChange = async () => {
        const newStatus = getNextStatus(status);
        try {
            const response = await axios.put(
                `${BACKEND_URL}/task/${_id}`,
                { status: newStatus },
                { withCredentials: true }
            );
            updateTask(response.data.task);
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${BACKEND_URL}/task/${_id}`, { withCredentials: true });
            deleteTask(_id);
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const getStatusIcon = () => {
        if (status === "To Do") return "➤";
        if (status === "In Progress") return "⟳";
        if (status === "Completed") return "✔";
    };

    const isCompleted = status === "Completed";

    return (
        <div className="w-full bg-zinc-950 rounded-xl border border-zinc-800 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4 ">
                    <button
                        type="button"
                        onClick={handleStatusChange}
                        title="Change Status"
                        className="text-lg h-fit px-2 py-1 rounded-full  bg-zinc-800 hover:bg-zinc-700 transition-all duration-200"
                    >
                        {getStatusIcon()}
                    </button>
                    <div className="flex flex-col gap-1">
                        <h2 className={`text-2xl font-semibold ${isCompleted ? "line-through text-zinc-500" : "text-white"}`}>
                            {title}
                        </h2>
                        <div className="flex gap-2">
                            <span className="text-xs px-3 py-1 rounded-full bg-zinc-700 text-zinc-200 capitalize">{status}</span>
                            <span className="text-xs px-3 py-1 rounded-full bg-indigo-700 text-white capitalize">{priority}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDelete}
                        title="Delete"
                        className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                    >
                        <BsTrash size={16} />
                    </button>
                </div>
            </div>

            <p className={`text-base ${isCompleted ? "line-through text-zinc-600" : "text-zinc-300"}`}>
                {description}
            </p>

            <div className="flex gap-6 mt-4 text-sm text-zinc-500 font-medium">
                <p className="flex items-center gap-1">
                    <BsClock size={12} />
                    {formatDate(createdAt)} • Created
                </p>
                <p className="flex items-center gap-1">
                    <RxUpdate size={12} />
                    {formatDate(updatedAt)} • Updated
                </p>
            </div>
        </div>
    );
};

export default TaskCard;
