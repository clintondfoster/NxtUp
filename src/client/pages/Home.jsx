import React from "react";
import CreateGroup from "../components/inputs/CreateGroup";
import JoinGroup from "../components/inputs/JoinGroup";
import CreateVote from "../components/inputs/CreateVote";
import CreateSubmission from "../components/inputs/CreateSubmission";
import { useSelector } from "react-redux";
// import { selectGroupId } from "../reducers/api";


const Home = () => {
  // const groupId = useSelector(selectGroupId);

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
