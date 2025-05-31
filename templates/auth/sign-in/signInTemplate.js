module.exports = () => `
'use client'
import { useState, useEffect } from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';

function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Signed in successfully.");
      router.push("/");
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="border-2 border-[#353535] rounded-[1em] p-5 w-2/5 h-[80%] bg-[#827ae8] flex flex-col justify-center items-center gap-5">
        <h1 className="text-white text-3xl font-semibold">Sign In</h1>

        <form onSubmit={handleSubmit} className="w-[45%] flex flex-col justify-center items-center gap-4 mt-4">
          
          <div className="bg-white flex items-center px-4 py-2 rounded-md w-full">
            <MailOutlineRoundedIcon className="text-gray-700 mr-2" />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="bg-white flex items-center px-4 py-2 rounded-md w-full mb-4">
            <LockOpenRoundedIcon className="text-gray-700 mr-2" />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-14 py-3 rounded-lg bg-white text-black hover:bg-[#06c3b9] cursor-pointer hover:text-white transition"
          >Sign In</button>

          <h5 className="text-white">------ Or ------</h5>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="px-8 py-3 rounded-xl bg-white flex items-center justify-center gap-4 cursor-pointer hover:bg-gray-200 transition"
          >
            <img src="/google.svg" alt="Google" className="h-[30px]" />
            Sign In With Google
          </button>

          <a href="/sign-up" className="text-white mt-2">
            Don't have an account? <span className="font-bold">Sign Up</span>
          </a>
        </form>
      </div>
    </div>
  )
}

export default SignIn

`;