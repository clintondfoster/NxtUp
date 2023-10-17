import React from "react";
import CreateGroup from "../components/inputs/CreateGroup";
import JoinGroup from "../components/inputs/JoinGroup";


const Home = () => {
  return (
    <>
      {" "}
      <h2>Home Page</h2>
      <div>
        <CreateGroup /> 
      </div>
      <div>
        <JoinGroup />
      </div>
    </>
  );
};

export default Home;
