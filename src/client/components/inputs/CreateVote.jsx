import React, { useState, Fragment } from "react";
import { useCreateVoteMutation } from "../../reducers/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";


const CreateVote = ({ questionId, submissionId }) => {

  const socket = io.connect("http://localhost:3000");
  socket.on("connect", () => {});

  const [createVote] = useCreateVoteMutation();

  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive(!active);
  };

  const onCreateVote = async () => {
    await createVote({ questionId, submissionId })
      .then(() => {
        console.log("vote cast for", submissionId);
        socket.emit("new_vote", submissionId);
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
