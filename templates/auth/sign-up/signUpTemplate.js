module.exports = () => `
'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession, signIn } from 'next-auth/react';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

function SignUp() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [formData, setFormData] = useState({ name: "", surname: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Successfully Registered.");

        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false
        });

        if (res.ok) {
          router.push("/");
        } else {
          console.log("Login failed after sign-up, error: ", res.error);
        }
      } else {
        toast.error("Registration Failed.");
      }

    } catch (error) {
      console.log("Error adding user", error);
      toast.error("Registration Failed.");
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="border-2 border-[#353535] p-5 w-2/5 h-[80%] bg-[#827ae8] flex flex-col justify-center items-center gap-4 rounded-xl">
        <h1 className="text-white text-3xl font-semibold">Sign Up</h1>

        <form onSubmit={handleSubmit} className="w-[80%] flex flex-col justify-center items-center gap-4 my-4">

          <div className="flex justify-center items-center gap-4 p-2 w-full">
            <div className="bg-white flex items-center px-4 py-2 rounded-md w-full">
              <PersonOutlineRoundedIcon className="text-gray-700 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full outline-none border-none bg-transparent"
              />
            </div>
            <div className="bg-white flex items-center px-4 py-2 rounded-md w-full">
              <PersonOutlineRoundedIcon className="text-gray-700 mr-2" />
              <input
                type="text"
                name="surname"
                placeholder="Surname"
                value={formData.surname}
                onChange={handleChange}
                required
                className="w-full outline-none border-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 p-2 w-full">
            <div className="bg-white flex items-center px-4 py-2 rounded-md w-full">
              <MailOutlineRoundedIcon className="text-gray-700 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full outline-none border-none bg-transparent"
              />
            </div>
            <div className="bg-white flex items-center px-4 py-2 rounded-md w-full">
              <LockOpenRoundedIcon className="text-gray-700 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full outline-none border-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-14 py-4 rounded-lg cursor-pointer bg-white hover:bg-[#06c3b9] hover:text-white transition"
          >
            Sign Up
          </button>

          <h5 className="text-white">------ Or ------</h5>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="px-8 py-3 rounded-xl bg-white flex items-center justify-center gap-4 cursor-pointer hover:bg-gray-200 transition"
          >
            <img src="/google.svg" alt="Google" className="h-[30px]" />
            Sign Up With Google
          </button>

          <a href="/sign-in" className="text-white mt-2">
            Already have an account? <span className="font-bold">Sign In</span>
          </a>
        </form>
      </div>
    </div>
  );
}

export default SignUp;


`;