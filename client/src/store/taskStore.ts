import { create } from "zustand";
import type taskProp from "../interfaces/taskInterface";

type TaskStoreType = {
    tasks: taskProp[];
    setTask: (tasks: taskProp[]) => void;
    addTask: (task: taskProp) => void;
};

const useTaskStore = create<TaskStoreType>((set) => ({
    tasks: [],
    setTask: (tasks) => set({ tasks }),
    addTask: (task) =>
        set((state) => ({
            tasks: [...state.tasks, task],
        })),
}));

export default useTaskStore;
