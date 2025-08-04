import { create } from "zustand";
import type userProp from "../interfaces/userInterface";

type UserStoreType = {
    user: userProp | null,
    setUser: (user: userProp) => void
    isLoading: boolean,
    setLoading: (value: boolean) => void
}

const useUserStore = create<UserStoreType>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    isLoading: true,
    setLoading: (value) => set({ isLoading: value })

}))

export default useUserStore;