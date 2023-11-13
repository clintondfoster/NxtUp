import React from "react";
import CreateGroup from "../components/Home/CreateGroup";
import JoinGroup from "../components/Home/JoinGroup";
import DisplayUserGroups from "../components/Home/DisplayUserGroups";
import HowToPlay from "../components/Home/HowToPlay";
import "./Home.scss";

const Home = () => {
   return (
      <div className="home-container">
         <div className="home-quip">
            Create or join a Group to figure out whats UpNxt!
         </div>
         <div className="join-container">
            {/* <p>Enter your url link or your group code here.</p> */}
            <JoinGroup />
         </div>
         <p style={{ padding: 10 }}>or</p>
         <div className="create-container">
            <CreateGroup />
         </div>
         <hr />
         <div className="display-container">
            <DisplayUserGroups />
         </div>
      </div>
   );
};

export default Home;
