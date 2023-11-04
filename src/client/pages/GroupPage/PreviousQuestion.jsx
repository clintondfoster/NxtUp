import React from "react";
import { useParams } from "react-router-dom";
import { useGetInactiveQuestionsForGroupQuery } from "../../reducers/api";
const PreviousQuestion = () => {
  const { accessCode } = useParams();
  const { data, isLoading } = useGetInactiveQuestionsForGroupQuery(accessCode);
  return (
    <div>
      <h3>Previous Question: </h3>
      {isLoading ? (
        <h1>loading....</h1>
      ) : (
        data.map((data) => (
          <div key={data.id}>
            <li>{data.title}</li>
          </div>
        ))
      )}
    </div>
  );
};

export default PreviousQuestion;
