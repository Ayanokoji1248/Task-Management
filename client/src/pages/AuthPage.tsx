import { useState, type FormEvent } from "react"
import { BACKEND_URL } from "../utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";

const AuthPage = () => {
    const navigate = useNavigate();

    const { setUser } = useUserStore();

    const [authState, setAuthState] = useState("login");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = authState === "register" ? { username, email, password } : { email, password }
            const response = await axios.post(`${BACKEND_URL}/auth/${authState}`, payload, { withCredentials: true });
            setUsername("")
            setEmail("")
            setPassword("")
            // console.log(response.data)
            setUser(response.data.user)
            navigate('/home')
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-[#161F2F]">
            <div className="flex flex-col min-h-screen items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#0A0A0A] dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="flex flex-col items-center gap-3 ">
                            <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                {authState === "register" ? "Create Account" : "Welcome Back"}
                            </h1>
                            {authState === "register" ? (
                                <p className="text-zinc-500 font-medium text-sm">Sign up to start managing your tasks</p>
                            ) : (
                                <p className="text-zinc-500 font-medium text-sm">Sign in to your account to continue</p>
                            )}


                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            {authState === "register" &&
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                    <input onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" className="bg-gray-50 font-medium border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Enter your username" required />
                                </div>
                            }
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 font-medium border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Enter your email" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" className="bg-gray-50 font-medium border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Enter your password" required />
                            </div>

                            <button disabled={loading} type="submit" className="w-full text-zinc-950 bg-white cursor-pointer hover:bg-neutral-200 md:transition-all duration-300  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                {loading ? "Loading..." : authState === "register" ? "Create Account" : "Login"}
                            </button>
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                {authState === "register" ? (
                                    <>
                                        Already have an account?{" "}
                                        <button type="button"
                                            onClick={() => setAuthState("login")}
                                            className="font-bold cursor-pointer text-zinc-200 hover:underline dark:text-zinc-200"
                                        >
                                            Login here
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Don’t have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => setAuthState("register")}
                                            className="font-bold text-zinc-200 hover:underline cursor-pointer dark:text-zinc-200"
                                        >
                                            Register here
                                        </button>
                                    </>
                                )}
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default AuthPage