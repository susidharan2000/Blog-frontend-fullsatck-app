import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../Redux/Slice/UserSlice";
import { HiDocumentText } from "react-icons/hi2";

const Dashboardsidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, settab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab"); //tab=profile
    if (tabUrl) {
      settab(tabUrl); //profile
    }
    //console.log(tabUrl);
  }, [location.search]);
  const handleClickSignOut = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem("Token");
  };
  return (
    <div>
      <Sidebar className="w-full md:w-58 ">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={!currentUser.rest.isAdmin ? "User" : "Admin"}
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            {currentUser.rest.isAdmin && (
              <Link to="/dashboard?tab=createpost">
                <Sidebar.Item icon={HiDocumentText} className="cursor-pointer">
                  Create Post
                </Sidebar.Item>
              </Link>
            )}
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              onClick={handleClickSignOut}
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default Dashboardsidebar;
