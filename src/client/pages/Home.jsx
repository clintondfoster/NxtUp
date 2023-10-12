import React from "react";
import { useState } from "react";
import { useAddGroupMutation } from "../reducers/api";

const Home = () => {
  const [groupName, setGroupName] = useState("");
  const [createGroup] = useAddGroupMutation();

  const handleCreateGroup = async () => {
    try {
      const response = await createGroup({ name: groupName });
      console.log('Group created:', groupName)
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  return (
    <>
      {" "}
      <h2>Home Page</h2>
      <div>
        <input
          placeholder="Group Name"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
      <div>
        <input placeholder="Enter Group Code" />
        <button>Join group</button>
      </div>
    </>
  );
};

export default Home;
