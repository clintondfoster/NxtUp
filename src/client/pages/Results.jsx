import React from "react";
import { useGetGroupByCodeQuery } from "../reducers/api";
import CreateQuestion from "../components/inputs/CreateQuestion";
import { useParams } from "react-router-dom";

const Results = () => {
  const { accessCode } = useParams();
  const { data, isLoading } = useGetGroupByCodeQuery(accessCode);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    const group = data;

    return (
      <div>
        <h1>Group Name: {group.name}</h1>
        <h4>Code: {group.access_code}</h4>
        <CreateQuestion groupId={group.id} />
      </div>
    );
  }

  return null;
};

export default Results;
