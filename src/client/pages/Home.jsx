import React from "react";
import CreateGroup from "../components/Home/CreateGroup";
import JoinGroup from "../components/Home/JoinGroup";
import DisplayUserGroups from "../components/Home/DisplayUserGroups";
import HowToPlay from "../components/Home/HowToPlay";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home-container">
      <div className="join-container">
        <JoinGroup />
      </div>
      <p style={{ padding: 10 }}>or</p>
      <div className="create-container">
        <CreateGroup />
      </div>
      <div>Ditch the Doubt! Join NxtUp and let their voice be the choice!</div>
      <div>Create or Join a group to figure out what's NxtUp</div>
      <hr />
      <div className="display-container">
        <DisplayUserGroups />
      </div>
    </div>
  );
};

export default Home;
