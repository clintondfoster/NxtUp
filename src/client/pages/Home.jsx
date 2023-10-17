import React from "react";
import CreateGroup from "../components/inputs/CreateGroup";
import CreateQuestion from "../components/inputs/CreateQuestion";
import JoinGroup from "../components/inputs/JoinGroup";
import CreateVote from "../components/inputs/CreateVote";
import CreateSubmission from "../components/inputs/CreateSubmission";

const Home = () => {
  return (
    <>
      {" "}
      <h2>Home Page</h2>
      <div>
        <CreateGroup /> 
      </div>
      <div>
        <CreateQuestion /> 
      </div>
      <div>
        <JoinGroup />
      </div>
      <div>
        <CreateSubmission />
      </div>
      <div>
        <CreateVote />
      </div>
    </>
  );
};

export default Home;
