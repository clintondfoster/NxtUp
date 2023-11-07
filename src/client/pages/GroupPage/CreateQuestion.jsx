import { useState } from "react";
import { useAddQuestionMutation } from "../../reducers/api";
import { useGetCurrentUserQuery } from "../../reducers/auth";

const CreateQuestion = ({ groupId }) => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [createQuestion] = useAddQuestionMutation();

  const { data: currentUser } = useGetCurrentUserQuery();

  const handleCreateQuestion = async () => {
    try {
      const response = await createQuestion({
        title: questionTitle,
        group_id: groupId,
      });
      setQuestionTitle("");
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  const isCreator = currentUser?.user?.roles?.some(
    (role) => role.group_id === groupId && role.is_creator
  );
 
  if (isCreator) {
    return (
      <div>
        <input
          placeholder="Enter Question"
          type="text"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
        />
        <button disabled={!questionTitle} onClick={handleCreateQuestion}>Create Question</button>
      </div>
    );
  } else {
    return <div>Please wait for question to be created.</div>;
  }

  return (
    <div>
      <input
        placeholder="Enter Question"
        type="text"
        value={questionTitle}
        onChange={(e) => setQuestionTitle(e.target.value)}
      />
      <button onClick={handleCreateQuestion}>Create Question</button>
    </div>
  );
};

export default CreateQuestion;
