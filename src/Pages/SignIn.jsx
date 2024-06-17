import { Button, Label, TextInput, Spinner} from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import { useDispatch,useSelector } from 'react-redux';
import  {signInStart,signInSuccess,signInFailure} from '../Redux/Slice/UserSlice';
import OAuth from '../Components/OAuth';


const SignIn = () => {
    const [formdata,setFromdata] = useState({});
    const dispatch = useDispatch();
    const {loading,error:errormessage} = useSelector((state)=>state.user);
    const navigate = useNavigate();
    const handleChange = (e) => {
        e.preventDefault();
        setFromdata({...formdata,[e.target.id]:e.target.value.trim()});
    }
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior
    
        // Checking if any of the required form fields are empty
        if (!formdata.password || !formdata.email) {
           dispatch(signInFailure(("please fill out the fields")));
            //return console.log("please fill out the fields");
        }
    
        try {
            dispatch(signInStart());
            // Sending a POST request to the server with form data
            const response = await fetch('http://localhost:4000/api/auth/loginuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formdata) // Converting form data to JSON string
            });
    
            const data = await response.json(); // Parsing response data as JSON
    
            // Handling the response data
            if (data.success === false) {
                return dispatch(signInFailure((data.message))); // Setting error message if registration fails
            }
            if (response.ok) {
              console.log("Data received from server:", data);
              if (data.token) {
                  localStorage.setItem('Token', data.token);
                  console.log("Token stored in localStorage:", data.token);
              } else {
                  console.error("Token is missing in the response data:", data);
              }
              dispatch(signInSuccess(data)); // Setting the current user if sign-in succeeds
              navigate('/blogs');
          } else {
              console.error("Sign-in request failed with status:", response.status);
              dispatch(signInFailure("Sign-in request failed")); // Setting error message if sign-in fails
          }
          
        } catch (error) {
          dispatch(signInFailure((error.message))); // Catching and logging any errors that occur during the fetch request
            
        }
        // Clear form fields after successful submission
        setFromdata({
            password: '',
            email: ''
        });
    }
    
    return (
      <div className="min-h-screen mt-20">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <div className="font-bold dark:text-white text-4xl">
              <span className="px-2 py-1 bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 rounded-lg text-white">
                Blogger
              </span>
              Hunt!
            </div>
            <p className="text-sm mt-6">
              You can sign up with your Email and password or you can use the
              Google. **This is the demo project**
            </p>
          </div>
          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label value="Email" />
                <TextInput
                  type="email"
                  placeholder="name@company.com"
                  id="email"
                  name="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Password" />
                <TextInput
                  type="password"
                  placeholder="Enter Your Password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                />
              </div>
              <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
             {loading ? (
                <>
                <Spinner color="purple" aria-label="Purple spinner example" size='sm'/>
                <span className="pl-3">Loading...</span>
                </>
             ) : ( 
                'Sign In'
             )
            }
            </Button>
            <h2 className='text-center'>or</h2>
            <OAuth />
            </form>
            <div className="flex gap-2 text-sm mt-6 mb-4">
              <Link to="/forgetpassword" className="text-blue-500">
                Froget password ?
              </Link>
            </div>
            {errormessage && (
            <Alert color="failure" icon={HiInformationCircle}>
               please fill out the fields !
            </Alert>
)}
          </div>
        </div>
      </div>
    );
};

export default SignIn;