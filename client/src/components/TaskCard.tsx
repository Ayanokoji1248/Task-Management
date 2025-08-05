import { BsClock, BsThreeDots } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import type taskProp from "../interfaces/taskInterface";

const TaskCard = ({ title, description, status, priority, createdAt, updatedAt }: taskProp) => {

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

    return (
        <div className="w-full h-58 bg-zinc-950 rounded-md border-[1px] border-zinc-800 p-5 flex flex-col justify-start gap-10">
            <div>
                <div className="flex justify-between">
                    <div className="flex items-start gap-5">
                        <button>O</button>
                        <div className="flex flex-col gap-2">
                            <h1 className="font-bold text-2xl">{title}</h1>
                            <div className="flex gap-2">
                                <span className="text-xs p-1 px-2.5 bg-neutral-600 rounded-full font-medium">{status}</span>
                                <span className="text-xs p-1 px-2.5 bg-neutral-600 rounded-full font-medium">{priority}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button className="p-2 rounded-md hover:bg-zinc-900 cursor-pointer">
                            <BsThreeDots />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div>
                    <p className="text-zinc-500 text-lg">{description}</p>
                </div>

                <div className="flex gap-4">
                    <p className="text-xs text-zinc-400 font-medium flex items-center justify-center gap-1">
                        <BsClock size={12} /> {formatDate(createdAt)} • Created
                    </p>
                    <p className="text-xs text-zinc-400 font-medium flex items-center justify-center gap-1">
                        <RxUpdate size={12} /> {formatDate(updatedAt)} • Updated
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
