'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

function Edit() {
  const { data: session } = useSession();
  const [file, setFile] = useState();
  const [imgUrl, setImgUrl] = useState();
  const [saveLoading, setSaveLoading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const foldername = "RealEstatingo";
      formData.append("folderName", foldername);
      setImgUploading(true);

      const res = await fetch('/api/fileupload', {
        method: 'POST',
        body: formData,
      });
      
      setImgUploading(false);

      if (res.ok) {
        const response = await res.json();
        return response.url;
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const saveEdit = async () => {

    const name = document.getElementById('name')?.value;
    const surname = document.getElementById('surname')?.value;
    const uploadedImgUrl = await uploadImage();

    if(!name || !surname || !uploadedImgUrl){
      console.error("All fields are required!!!");
      return;
    }
    
    setSaveLoading(true);

    const dataToSave = {
      name,
      surname,
      image: uploadedImgUrl,
    };

    const resp = await fetch('/api/auth/saveUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave),
    });
    setSaveLoading(false);

    if (resp.ok) {
      toast.success('Changes Saved.');
      setTimeout(() => window.location.reload(), 500);
    } else {
      toast.error('Error updating user.');
    }
  };

  return (
    <div className="editPage w-screen h-[calc(100vh-100px)] flex justify-center items-center">
      <div className="editSection flex flex-col items-center justify-start border-2 border-black rounded-2xl w-[85%] h-[90%] px-8 py-5 gap-8 mx-auto">
        <div className="editTop py-4 flex justify-between items-center w-full px-6 border-b-2">
          <div className="editTopLeft flex items-center gap-6 w-full h-15 ">
            <Image
              className="aspect-1/1 rounded-full border-2 border-black"
              src={imgUrl || session?.user?.image || '/profileicon.png'}
              alt="pp"
              height={55}
              width={55}
            />
            <div
              className="flex items-center justify-center bg-gray-200 rounded-lg px-6 py-4  cursor-pointer hover:bg-red-500 hover:text-white"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={(e) => { setFile(e.target.files?.[0]); setImgUrl(URL.createObjectURL(e.target.files?.[0])) }}
              />
              Upload Image
            </div>
            <span>{imgUploading ? "Uploading..." : ""}</span>
          </div>

          <div
            className="editTopRight cursor-pointer px-10 py-4 bg-green-500 text-white rounded-xl hover:scale-105 transition-transform"
            onClick={saveEdit} 
          >
            {saveLoading ? "Saving..." : "Save"}
          </div>
        </div>

        <div className="flex w-full gap-10">
          <div className="flex flex-col gap-4 w-1/2">
            <div className="itemSec flex flex-col justify-center items-start gap-1">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                defaultValue={session?.user?.name}
                className="border p-2 rounded-md w-[35%]"
                placeholder="text"
              />
            </div>

            <div className="itemSec flex flex-col justify-center items-start gap-1">
              <label htmlFor="surname">Surname:</label>
              <input
                id="surname"
                defaultValue={session?.user?.surname}
                className="border p-2 rounded-md w-[35%]"
                placeholder="text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
