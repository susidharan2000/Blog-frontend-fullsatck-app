import { Button, DropdownHeader, Navbar, NavbarCollapse, TextInput } from 'flowbite-react';
import React from 'react';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";
import { IoMoon } from "react-icons/io5";
import { IoReorderThreeOutline } from "react-icons/io5";
import { Avatar,Dropdown } from 'flowbite-react';
import { useSelector,useDispatch } from 'react-redux';
import { IoIosSunny } from "react-icons/io";
import  toggleTheme from "../Redux/Slice/ThemeSlice";
import { signOutSuccess } from '../Redux/Slice/UserSlice';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const path = useLocation().pathname;
    const {currentUser} = useSelector(((state)=>state.user));
    const {theme} = useSelector((state=>state.theme));
    //console.log(currentUser);
    //console.log(theme);
    const HandletoggleTheme = ()=>{
        dispatch(toggleTheme());
    }
    const handleClicklogout = ()=>{
        dispatch(signOutSuccess());
        localStorage.removeItem('token');
        navigate("/signIn");
    }
    return (
        <Navbar className='border-b-2 dark:bg-black'>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-violet-500 via-fuchisa-700 to-pink-500 rounded-lg text-white'>
                    Blogger
                </span>
                Hunt!
            </Link>
            <form>
               <TextInput type="text" placeholder='Search blogs...' rightIcon={AiOutlineSearch} className="hidden lg:inline"/>
            </form>
            <Button className='w-14 h-9 lg:hidden text-dark' gradientDuoTone="purpleToPink" outline pill>
                <AiOutlineSearch />
            </Button>
            <NavbarCollapse >
                <Navbar.Link className='nav-item' active={path=== "/"} as="div">
                    <Link to="/">Home</Link>  
                </Navbar.Link>
                <Navbar.Link active={path=== "/about"} as="div">
                <Link to="/about">About</Link>
                </Navbar.Link>
                <Navbar.Link active={path=== "/blogs"} as="div">
                <Link to="/blogs">Blog</Link>       
                    </Navbar.Link>
            </NavbarCollapse>
            <div className='flex gap-2 sm:gap-5'>
            <Button className='w-14 h-9 hidden sm:inline' gradientDuoTone="purpleToPink" outline pill onClick={HandletoggleTheme}>
      {theme === 'light' ? <IoMoon /> : <IoIosSunny />}
    </Button>
            {currentUser ?(
                <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={currentUser.rest.profilePic} rounded />}>
                        <Dropdown.Header>
                        <span className="block text-sm" >{currentUser.rest.username}</span>   
                        </Dropdown.Header>  
                        <Link to="./dashboard?tab=profile">
                            <Dropdown.Item>
                                profile
                            </Dropdown.Item>
                        </Link>   
                        <Dropdown.Item onClick={handleClicklogout}>
                                Log Out
                            </Dropdown.Item>     
                </Dropdown>
            ):(
                <Link to="/signup">
            <Button className='w-14 h-9 hidden sm:inline ml-3' gradientDuoTone="purpleToPink" outline pill>
            SignUp
            </Button>
            </Link> 
            )}
            <Button className='w-14 h-9 lg:hidden md:hidden text-dark ' gradientDuoTone="purpleToPink" outline pill>
            <IoReorderThreeOutline /> 
            </Button>
            </div>
        </Navbar>
    );
};

export default Header;