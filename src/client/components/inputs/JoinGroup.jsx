import { useState } from "react";
import { useAddRoleMutation } from "../../reducers/api";

const JoinGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [createRole] = useAddRoleMutation();

  const handeCreateRole = async () => {
    try {
      const response = createRole({ group_name: groupName });
      console.log("Group joined:", groupName);
      console.log("Role created");
      setGroupName("");
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  return (
    <div>
      <input
        placeholder="Group Code"
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handeCreateRole}>Join group</button>
    </div>
  );
};

export default JoinGroup;
