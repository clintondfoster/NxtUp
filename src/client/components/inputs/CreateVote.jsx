import React, { useState, Fragment, useEffect } from "react";
import { useCreateVoteMutation } from "../../reducers/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";



const CreateVote = ({ questionId, submissionId }) => {

  const socket = io.connect("http://localhost:3000");
  socket.on("connect", () => {});

  const [createVote] = useCreateVoteMutation();
  const user = useSelector((state) => state.auth.credentials.user);
  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive(!active);
  };
  useEffect(() => {
    async function findVote() {
      const req = await fetch(`/api/vote/voted/${submissionId}/${user.userId}`);
      const res = await req.json();
      // console.log(res, "res");
      if (res) {
        handleClick();
      }
    }
    findVote();
  }, []);
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
