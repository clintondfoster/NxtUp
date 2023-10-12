import { useState } from "react";
import { useAddGroupMutation } from "../../reducers/api";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [createGroup] = useAddGroupMutation();
  const handleCreateGroup = async () => {
    try {
      const response = await createGroup({ name: groupName });
      console.log("Group created:", groupName);
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  return (
    <div>
      <input
        placeholder="Group Name"
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handleCreateGroup}>Create Group</button>
    </div>
  );
};

export default CreateGroup;
