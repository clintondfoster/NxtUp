import { useState } from "react";
import { useAddRoleMutation } from "../../reducers/api";

const JoinGroup = () => {
  const [accessCode, setAccessCode] = useState("");
  const [createRole] = useAddRoleMutation();

  const handleCreateRole = async () => {
    try {
      await createRole({ accessCode: accessCode });
      console.log("Group joined:", accessCode);
      console.log("Role created");
      setAccessCode("");
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  return (
    <div>
      <input
        placeholder="Group Code"
        type="text"
        value={accessCode}
        onChange={(e) => setAccessCode(e.target.value)}
      />
      <button onClick={handleCreateRole}>Join group</button>
    </div>
  );
};

export default JoinGroup;
