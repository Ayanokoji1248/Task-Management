import { BsClock, BsThreeDots } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";

const TaskCard = () => {
    return (
        <div className="md:w-96 w-full h-58 bg-zinc-950 rounded-md border-[1px] border-zinc-800 p-5 flex flex-col justify-start gap-10">
            <div>
                <div className="flex justify-between">
                    <div className="flex items-start gap-5">
                        <button>O</button>
                        <div className="flex flex-col gap-2">
                            <h1 className="font-bold text-2xl">Title</h1>
                            <div className="flex gap-2">
                                <span className="text-xs p-1 px-2.5 bg-neutral-600 rounded-full font-medium">To Do</span>
                                <span className="text-xs p-1 px-2.5 bg-neutral-600 rounded-full font-medium">Medium</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button className="p-2 rounded-md hover:bg-zinc-900 cursor-pointer">
                            <BsThreeDots />
                        </button>
                    </div>
                </div>
                <div></div>
            </div>
            <div className="space-y-2">
                <div>
                    <p className="text-zinc-500 text-lg">Create mockups for the new dashboard feature</p>
                </div>

                <div className="flex gap-4">
                    <p className="text-xs text-zinc-400 font-medium flex items-center justify-around gap-1"><BsClock size={12} /> Created at</p>
                    <p className="text-xs text-zinc-400 font-medium flex items-center justify-center gap-1"><RxUpdate size={12}/> Updated at</p>
                </div>
            </div>
        </div>
    )
}

export default TaskCard