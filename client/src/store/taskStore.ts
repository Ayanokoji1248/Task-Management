import { create } from "zustand";
import type taskProp from "../interfaces/taskInterface";

type TaskStoreType = {
    tasks: taskProp[];
    setTask: (tasks: taskProp[]) => void;
    addTask: (task: taskProp) => void;
    updateTask: (task: taskProp) => void;
    deleteTask: (taskId: string) => void;

    tasksCount: () => { todo: number, inProgress: number, completed: number }
};

const useTaskStore = create<TaskStoreType>((set, get) => ({
    tasks: [],
    setTask: (tasks) => set({ tasks }),
    addTask: (task) =>
        set((state) => ({
            tasks: [task, ...state.tasks],
        })),
    updateTask: (updatedTask) =>
        set((state) => ({
            tasks: state.tasks.map(task => task._id == updatedTask._id ? updatedTask : task)
        })),
    deleteTask: (taskId) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task._id !== taskId),
        })),

    tasksCount: () => {
        const tasks = get().tasks;
        return {
            todo: tasks.filter((t) => t.status === "To Do").length,
            inProgress: tasks.filter((t) => t.status === "In Progress").length,
            completed: tasks.filter((t) => t.status === "Completed").length,
        }
    }

}));

export default useTaskStore;
