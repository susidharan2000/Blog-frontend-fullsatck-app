import { Alert,Button,FileInput,Select,TextInput } from "flowbite-react";
import React,{useRef, useState} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { app } from '../Firebase';
import {getDownloadURL,getStorage,ref,uploadBytes,uploadBytesResumable,} from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CreatePost = () => {
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError,setImageFileUploadError] = useState();
    const [formData,setFormdata] = useState({});
    const [publichError,setPublichError] = useState(null);
    const [imageFileUploading,setImageFileUploading] = useState(false);
    const navigate = useNavigate();

    // upload image file
    const handleUploadImage = async()=>{
        try{
        if(!imageFile){
            setImageFileUploadError('Please select an image');
            return;
        }
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const filename = new Date().getDate() + imageFile.name;
        const storageref = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageref,imageFile);
        uploadTask.on('state_changed',(snapshot)=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadProgress(progress.toFixed(0)); //10.6794764
        },
        (error) => {
            setImageFileUploadError("Image upload failed");
            setImageFileUploadProgress(null);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageFileUploadProgress(null);
              setImageFileUploadError(null);
              setFormdata({...formData, image: downloadURL });
              
            });
        }
        );
    }
    catch(error){
        setImageFileUploadError("Image upload failed");
        setImageFileUploadProgress(null);
        console.log(error);
    }
    }
//create Post 
const handleClickPublich = async(e)=>{
    e.preventDefault();
      if(imageFileUploading){
        setUpdataUserError("Please wait while the image is uploading");
        return;
      }
      try{
        const response = await fetch("http://localhost:4000/api/post/createpost",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                token: localStorage.getItem("Token"),
            },
            body:JSON.stringify(formData)
        });
        await response.json();
        if(response.ok){
            navigate('/blogs');
        }
      }
      catch(error){
        console.error(error); // Catching and logging any errors that occur during the fetch request
      }

}
    return (
        <div className=' w-full p-3 mx-auto min-h-screen'>
            <h1 className="text-center text-3xl my-7 font-semibold">
                Create Post
            </h1>
            <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput className='mb-4' type="text" id='title' placeholder='Enter the Title' onChange={(e)=>setFormdata({...formData,[e.target.id]:e.target.value})} />
                <select onChange={(e)=>setFormdata({...formData,category:e.target.value})}>
                    <option value="unCategorized">unCategorized</option>
                    <option value="Technology">Technology</option>
                    <option value="Sports">Sports</option>
                    <option value="Politics">Politics</option>
                    <option value="Business">Business</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Health">Health</option>
                    <option value="Science">Science</option>
                    <option value="Education">Education</option>
                    <option value="Lifestyle">Lifestyle</option>
                </select>
                <TextInput className='mb-4' type="text-area" id='content' placeholder='Content' onChange={(e)=>setFormdata({...formData,[e.target.id]:e.target.value})} />
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
          </div>
          {imageFileUploadError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">🥴OOPS!</span>
            {imageFileUploadError}
          </Alert>
        )}
        {formData.image && (
            <img
              src={formData.image}
              alt='upload'
              className="w-full h-72 object-cover"
            />
  
        )}
        <ReactQuill theme="snow" placeholder="Write Something....." required className="h-72 mb-12" value={formData.content} 
        onChange={(value)=>{
            setFormdata({...formData, content:value})
        }} />
        <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              onClick={handleClickPublich}>Publish
        </Button>
        {publichError && (
                <Alert color="failure" icon={HiInformationCircle} className="mt-5">
                  <span className="font-medium me-2">🥴OOPS!</span>
                  {publichError}
                </Alert>
  
            )}
            </form>
        </div>
    );
};

export default CreatePost;