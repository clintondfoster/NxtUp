import React from "react";
import CreateGroup from "../components/inputs/CreateGroup";
import CreateQuestion from "../components/inputs/CreateQuestion";
import JoinGroup from "../components/inputs/JoinGroup";

const Home = () => {

  return (
    <>
      {" "}
      <h2>Home Page</h2>
      <div>
        <CreateGroup/> {/* creates new group and sets users role as creator */}
      </div>
      <div>
        <CreateQuestion/>  {/* not functional yet  */}
      </div>
      <div>
        <JoinGroup/> 
      </div>
    </>
  );
};

export default Home;
