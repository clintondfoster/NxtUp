import { useState } from "react";
import { useAddGroupMutation, useAddRoleMutation } from "../../reducers/api";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
   const [createGroup] = useAddGroupMutation();
   const [successMessage, setSuccessMessage] = useState("");
   const navigate = useNavigate();

   const handleCreateGroup = async () => {
      try {
         const response = await createGroup();
         console.log("Backend response:", response);

         const createdGroup = response.data.group;
         console.log("Group created:", createdGroup);
         setSuccessMessage(
            `${createdGroup.name} is live! Share this code to add users to this group: ${createdGroup.access_code}`
         );

         setTimeout(() => {
            navigate(`/group/${createdGroup.access_code}`);
         }, 7000);
      } catch (err) {
         console.error("Error creating group:", err);
      }
   };

   return (
      <div>
         {successMessage && <div>{successMessage}</div>}
         <button onClick={handleCreateGroup}>Create Group</button>
      </div>
   );
};

export default CreateGroup;
