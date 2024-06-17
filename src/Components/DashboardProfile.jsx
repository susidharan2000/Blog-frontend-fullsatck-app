import { Button, TextInput,Alert } from 'flowbite-react';
import React,{useState,useEffect,useRef} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import {getDownloadURL,getStorage,ref,uploadBytes,uploadBytesResumable,} from 'firebase/storage';
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { signOutSuccess,upadateStart,upadateSuccess,updateFailure,deleteUserStart,deleteUserFailure,deleteUserSuccess } from '../Redux/Slice/UserSlice';
import { HiInformationCircle,HiOutlineExclamationCircle } from "react-icons/hi";
import { Modal } from 'flowbite-react';


const DashboardProfile = () => {
    const {currentUser,loading,error} = useSelector(((state)=>state.user));
    const dispatch = useDispatch();
    //states for upload image to firebase
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl,setImageFileUrl] = useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError,setImageFileUploadError] = useState();
    const filePickerRef =useRef();
    //states fro updating userdata
    const [formData,setFormdata] = useState({});
    const [imageFileUploading,setImageFileUploading] = useState(false);
    const [updateUserSuccess,setUpdataUserSuccess] = useState(null);
    const [updateUserError,setUpdataUserError] = useState(null); 
    //for delete show modal
    const [showModal,setshowModal] = useState(false);

const handleImageChange = (e) =>{
    const file = e.target.files[0];
    if(file){
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));       
    }
};

useEffect(()=>{
    if(imageFile){
        uploadImage();
    }
},[imageFile])
//firebase image upload and storage part
const uploadImage =async()=>{
    setImageFileUploadError(null);
    setImageFileUploading(true);
    const storage = getStorage(app);
    const filename = new Date().getDate() + imageFile.name;
    const storageref = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageref,imageFile);
    uploadTask.on('state_changed',(snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0)); //10.6794764
    },
    (error) => {
      setImageFileUploadError(
        "Could not upload the image (File size must be less than 2MB"
      );
      setImageFileUrl(null);
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUploading(false);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageFileUrl(downloadURL);
        setFormdata({...formData,profilePic:downloadURL});
        setImageFileUploading(false);
      });
    }
   );
};
//onChange in input field
const handleChange = (e) =>{
  setFormdata({...formData,[e.target.id]:e.target.value});
}
// updating user profile
const handleSubmit = async(e) =>{
  e.preventDefault();
  setUpdataUserError(null);
  setUpdataUserSuccess(null);
  if(Object.keys(formData).length === 0){
    setUpdataUserError("No Changes made!");
    return;
  }
  if(imageFileUploading){
    setUpdataUserError("Please wait while the image is uploading");
    return;
  }
  try{
    dispatch(upadateStart());
    const response = await fetch(`http://localhost:4000/api/user/update/${currentUser.rest._id}`,{
      method:'PUT',
      headers:{
        'Content-Type':'application/json',
        token: localStorage.getItem("Token"),
      },
      body:JSON.stringify(formData)
    });
    const data = await response.json();
    if(response.ok){
      dispatch(upadateSuccess(data));
      setUpdataUserSuccess("User Updated Successfully");
    }
    else{
      dispatch(updateFailure(data.message));
      setUpdataUserError(data.message);
    }
  }
  catch(error){
    dispatch(updateFailure(error.message));
      setUpdataUserError(error.message);
    }
};

//handle signout
const handleClickSignOut = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem("Token");
  };

//handle DeleteUser
const handleClickDelete = async()=>{
  setshowModal(false);
  try{
    dispatch(deleteUserStart());
    const response = await fetch(`http://localhost:4000/api/user/delete/${currentUser.rest._id}`,{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json',
        token: localStorage.getItem("Token"),
      }
    });
    const data = await response.json();
    if(response.ok){
      dispatch(deleteUserSuccess(data));
      handleClickSignOut();
    }
    else{
      dispatch(deleteUserFailure(data.message));
    }
  }
  catch(error){
    dispatch(deleteUserFailure(error.message));
  }
}

// up to this
    return(
        <div className='w-full'>
        <div className='max-w-lg mx-auto text-center p-4 w-full'>
          <h1 className="my-7 text-center font-semibold text-4xl">Profile</h1>
          <form className='' onSubmit={handleSubmit}>
            <input type="file" accept='image/*' ref={filePickerRef} onChange={handleImageChange}/>
      
            <div className='cursor-pointer flex flex-col gap-5 relative justify-center items-center' onClick={() => filePickerRef.current && filePickerRef.current.click()}>
              {imageFileUploadProgress && (
                <CircularProgressbar
                  value={imageFileUploadProgress || 0}
                  text={`${imageFileUploadProgress}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    },
                    path: {
                      stroke: `rgba(62,152,190,${imageFileUploadProgress / 100})`,
                    },
                  }}
                />
              )}
      
              <div className="w-40 h-40 flex justify-center items-center mb-4 mt-4">
                <img
                  src={imageFileUrl || currentUser.rest.profilePic}
                  alt="user"
                  className={`rounded-full object-cover border-8 border-[lightgray] ${
                    imageFileUploadProgress &&
                    imageFileUploadProgress < 100 &&
                    "opacity-40"
                  }`}
                />
              </div>
      
              {imageFileUploadError && (
                <Alert color="failure" icon={HiInformationCircle} className="mt-5">
                  <span className="font-medium me-2">🥴OOPS!</span>
                  {imageFileUploadError}
                </Alert>
              )}
            </div>
      
            <TextInput className='mb-4' type="text" id='username' placeholder='Username' onChange={handleChange} defaultValue={currentUser.rest.username}/>
            <TextInput className='mb-4' type="email" id='email' placeholder='Email'onChange={handleChange} defaultValue={currentUser.rest.email}/>
            <TextInput type="password" id='password' placeholder='*************'onChange={handleChange} />
      
            <Button type="submit" className='mt-5' gradientDuoTone="purpleToPink" disabled={loading || imageFileUploading}>
            {loading ? "loading..." : "update"}
            </Button>
          </form>
      
          <div className='text-red-600 flex justify-between mt-5'>
            <span className='cursor-pointer' onClick={()=>setshowModal(true)}>Delete Account</span>
            <span className='cursor-pointer' onClick={handleClickSignOut}>Sign Out</span>
          </div>
          {updateUserSuccess && <Alert color="success" icon={HiInformationCircle} className="mt-5">
                  <span className="font-medium me-2">🤗 Yheeee</span>
                {updateUserSuccess}
                </Alert>}
                {updateUserError && <Alert color="failure" icon={HiInformationCircle} className="mt-5">
                  <span className="font-medium me-2">🤗 Yheeee</span>
                {updateUserError}
                </Alert>}
        </div>
        {/* {
          error && (<Alert color="failure" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium me-2">🤗 Yheeee</span>
        {error}
        </Alert>)
        } */}
        <Modal show={showModal} onClose={() => setshowModal(false)} popup size='xl'>
          <Modal.Header />
          <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete Your Account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleClickDelete}>
                {"Delete"}
              </Button>
              <Button color="gray" onClick={() => setshowModal(false)}>
                cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
        </Modal>
      </div>
      
    );
};

export default DashboardProfile;