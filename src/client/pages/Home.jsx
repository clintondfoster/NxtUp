import React from "react";
import CreateGroup from "../components/inputs/CreateGroup";
import JoinGroup from "../components/inputs/JoinGroup";
import DisplayUserGroups from "../components/inputs/DisplayUserGroups";
import "./Home.scss"

const Home = () => {

  return (
    <div className="home">
   
      <h2 className="name">UpNxt!</h2>
  
      <div >
        <JoinGroup />
      </div>
      <p>or</p>
      <div className="creategroup">
        <CreateGroup />
      </div> 
      <hr></hr>
      <div>
        <DisplayUserGroups />
      </div>
    </div>
  );
};

export default Home;
