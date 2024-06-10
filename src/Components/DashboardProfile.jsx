import { Button, TextInput,Alert } from 'flowbite-react';
import React,{useState,useEffect,useRef} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import {getDownloadURL,getStorage,ref,uploadBytes,uploadBytesResumable,} from 'firebase/storage';
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { signOutSuccess } from '../Redux/Slice/UserSlice';

const DashboardProfile = () => {
    const {currentUser} = useSelector(((state)=>state.user));
    const dispatch = useDispatch();
    //stats for upload image to firebase
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl,setImageFileUrl] = useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError,setImageFileUploadError] = useState();
    const filePickerRef =useRef();

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
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageFileUrl(downloadURL);
      });
    }
   );
};

//handle signout
const handleClickSignOut = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem("token");
  };
// up to this
    return(
        <div className='w-full'>
        <div className='max-w-lg mx-auto text-center p-4 w-full'>
          <h1 className="my-7 text-center font-semibold text-4xl">Profile</h1>
          <form className=''>
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
      
            <TextInput className='mb-4' type="text" id='username' placeholder='Username' defaultValue={currentUser.rest.username}/>
            <TextInput className='mb-4' type="email" id='email' placeholder='Email' defaultValue={currentUser.rest.email}/>
            <TextInput type="password" id='password' placeholder='*************' />
      
            <Button type="submit" className='mt-5' gradientDuoTone="purpleToPink">
              Update
            </Button>
          </form>
      
          <div className='text-red-600 flex justify-between mt-5'>
            <span className='cursor-pointer'>Delete Account</span>
            <span className='cursor-pointer' onClick={handleClickSignOut}>Sign Out</span>
          </div>
        </div>
      </div>
      
    );
};

export default DashboardProfile;