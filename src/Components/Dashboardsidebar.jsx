import React, { useState } from 'react';
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight ,HiUser} from "react-icons/hi";
import { useEffect } from 'react';
import { useLocation,Link } from 'react-router-dom';
const Dashboardsidebar = () => {
    const location = useLocation();
    const [tab,settab] = useState("");
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const tabUrl = urlParams.get("tab"); //tab=profile
        if(tabUrl) {
            settab(tabUrl)//profile
        }
        console.log(tabUrl);
    },[location.search])
    return (
        <div>
             <Sidebar className='w-full md:w-58 '>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active={tab==='profile'} icon={HiUser} label={'User'} labelColor='dark' as='div'>Profile</Sidebar.Item>
                </Link>
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'>Sign Out</Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
       </Sidebar>
        </div>
    );
};

export default Dashboardsidebar;