import { useState } from "react";
import { useAddQuestionMutation } from "../../reducers/api";

const CreateQuestion = ({ groupId }) => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [createQuestion] = useAddQuestionMutation();
  const handleCreateQuestion = async () => {
    try {
      const response = await createQuestion({ 
        title: questionTitle, 
        group_id: groupId
       });
      console.log("Question created:", questionTitle);
      setQuestionTitle("");
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

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
