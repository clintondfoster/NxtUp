import { useState } from "react";
import { useGetGroupByCodeQuery } from "../reducers/api";
import CreateQuestion from "../components/inputs/CreateQuestion";
import DisplayQuestion from "../components/inputs/DisplayQuestion";

const Results = ({ groupCode, questionId }) => {
  const [createdQuestionId, setCreatedQuestionId] = useState(null);
  const { data, isLoading } = useGetGroupByCodeQuery(groupCode);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    const group = data;

    return (
      <div>
        <h1>Group Name: {group.name}</h1>
        <CreateQuestion groupId={group.id} />
        <DisplayQuestion groupId={group.id} /> 
        
      </div>
    );
  }

  return null;
};

export default Results;
