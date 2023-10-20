import React, { useState, Fragment } from "react";
import { useCreateVoteMutation } from "../../reducers/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
const CreateVote = ({ questionId, submissionId }) => {
  const [createVote] = useCreateVoteMutation();

  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive(!active);
  };

  const onCreateVote = async () => {
    await createVote({ questionId, submissionId })
      .then(() => {
        console.log("voted");
      })
      .catch(() => {
        console.log("error");
      });
  };

  return (
    <Fragment>
      <button
        onClick={function (event) {
          onCreateVote();
          handleClick();
        }}
        style={{ backgroundColor: active ? "green" : "white" }}
      >
        <FontAwesomeIcon icon={faHeart} />
      </button>
    </Fragment>
  );
};

export default CreateVote;
