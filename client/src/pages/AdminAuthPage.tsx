import React, { useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../utils";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

const AdminAuthPage = () => {

    const navigate = useNavigate();

    const { setUser } = useUserStore();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/login`, {
                email,
                password
            }, { withCredentials: true });

            setUser(response.data.user);
            navigate('/dashboard')

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setEmail("");
            setPassword("")
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-[#161F2F]">
            <div className="flex flex-col min-h-screen items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#0A0A0A] dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="flex flex-col items-center gap-3 ">
                            <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Welcome Back
                            </h1>

                        </div>
                        <form onSubmit={handleSubmit} method="POST" className="space-y-4 md:space-y-6">

                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 font-medium border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Enter your email" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" className="bg-gray-50 font-medium border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Enter your password" required />
                            </div>

                            <button disabled={loading} type="submit" className="w-full text-zinc-950 bg-white cursor-pointer hover:bg-neutral-200 md:transition-all duration-300  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                {loading ? "Loading..." : "Login"}
                            </button>


                        </form>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default AdminAuthPage