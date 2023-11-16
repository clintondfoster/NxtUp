import { useState, useEffect } from "react";
import { useAddQuestionMutation, useGetActiveQuestionsForGroupQuery } from "../../reducers/api";
import { useGetCurrentUserQuery } from "../../reducers/auth";
import "./CreateQuestion.scss";

const CreateQuestion = ({ groupId, accessCode }) => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [createQuestion] = useAddQuestionMutation();
  const { data: currentUser, refetch } = useGetCurrentUserQuery();

  const {
    data: questionsData,
    isLoading: questionsLoading,
    isError: questionsError,
    refetch: refetchQuestion,
  } = useGetActiveQuestionsForGroupQuery(accessCode);

  useEffect(() => {
    refetch();
  }, [groupId, refetch]);

  const handleCreateQuestion = async () => {
    try {
      const response = await createQuestion({
        title: questionTitle,
        group_id: groupId,
      });
      setQuestionTitle("");
      refetchQuestion()
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  const isCreator = currentUser?.user?.roles?.some(
    (role) => role.group_id === groupId && role.is_creator
  );

  function isEmpty() {
    if (questionTitle.trim().length === 0) {
      alert("Question can not be empty!");
      return true;
    } else {
      return false;
    }
  }

  if (isCreator) {
    return (
      <div className="create-question-container">
        <input
          className="create-question-input"
          placeholder="Enter Question"
          type="text"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
        />
        <div
          className="create-question-btn"
          onClick={() => {
            if (!isEmpty()) {
              handleCreateQuestion();
            }
          }}
        >
          Create Question
        </div>
      </div>
    );
  } else {
    return <div>Please wait for question to be created.</div>;
  }
};

export default CreateQuestion;
