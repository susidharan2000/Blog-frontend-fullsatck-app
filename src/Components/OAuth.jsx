import React from 'react';
import { Button } from 'flowbite-react';
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../Firebase';
import { signInFailure, signInSuccess } from '../Redux/Slice/UserSlice';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';


const OAuth = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async() => {
       const provider = new GoogleAuthProvider();
       provider.setCustomParameters({prompt:'select_account'});
       try {
        const result = await signInWithPopup(auth,provider)
        const res = await fetch("http://localhost:4000/api/auth/google",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
              name:result.user.displayName,
              email:result.user.email,
              profilePic:result.user.photoURL
            })
          
        })
        const data = await res.json();
        if(res.ok){
            dispatch(signInSuccess(data))
            navigate('/');
            localStorage.setItem(data.token);
        }
      } catch (error) {
        dispatch(signInFailure(error.message))
      }
    }
    return (
        <Button gradientDuoTone="purpleToPink" type="submit" onClick={handleSubmit}>
            <FcGoogle size={20}className="mr-2" />Continue with Google
        </Button>
    );
};

export default OAuth;