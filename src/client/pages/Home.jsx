import React from "react";
import CreateGroup from "../components/inputs/CreateGroup";
import CreateQuestion from "../components/inputs/CreateQuestion";

const Home = () => {

  return (
    <>
      {" "}
      <h2>Home Page</h2>
      <div>
        <CreateGroup/> 
      </div>
      <div>
        <CreateQuestion/>  {/* not functional yet  */}
      </div>
      <div>
        <input placeholder="Enter Group Code" />
        <button>Join group</button>
      </div>
    </>
  );
};

export default Home;
