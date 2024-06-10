import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardProfile from '../Components/DashboardProfile';
import Dashboardsidebar from '../Components/Dashboardsidebar';
import FooterCom from '../Components/Footer';

const Dashboard = () => {
    const location = useLocation();
    const [tab,setTab]= useState('')
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const tabUrl = urlParams.get('tab'); //tab = profile
        if(tabUrl){
            setTab(tabUrl)  //profile
        }
    },[location.search])
    return (
        <>
        <div className='min-h-screen flex flex-col md:flex-row'>
            <div className='md:w-58'>
                <Dashboardsidebar />
            </div>
            
                {tab === 'profile' && <DashboardProfile />}
        </div>
        <FooterCom />
        </>

    );
};

export default Dashboard;