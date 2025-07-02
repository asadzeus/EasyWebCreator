"use client"
import { signOut, useSession } from 'next-auth/react'
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Loading from '../loading';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Image from 'next/image';

function Profile() {

  const { data: session, status } = useSession();

  if (status !== "authenticated") return <Loading />;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-between items-center border-2 border-black rounded-2xl w-[85%] h-[90%] px-8 py-6">

        <div className="flex justify-between items-center border-b-2 border-black p-4 w-full">
          <div className="flex items-center gap-4">
            <Image width={55} height={55} alt='pp image' className="aspect-1/1 rounded-full" src={session?.user?.image ? session?.user.image : "/profileicon.png"} />
            <h2 className="font-normal">{session?.user?.name + " " + session?.user?.surname}</h2>

            {session?.user?.id !== session?.user?.id && (
              <a href={`/Messages/${session?.user?.id}`} className="text-gray-400 hover:text-black flex items-center"><SendRoundedIcon /></a>
            )}
            {session?.user?.id === session?.user?.id && (
              <a href="/Profile/Edit" className="flex items-center text-gray-400 hover:text-black">
                <EditRoundedIcon />
              </a>
            )}
          </div>

          {session?.user?.id === session?.user?.id && (
            <div
              className="cursor-pointer px-6 py-4 rounded-lg transition duration-200 hover:bg-red-600 hover:text-white"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile
