import React, { useState, Fragment, useEffect } from "react";
import { useCreateVoteMutation, useGetVotesForSubByUserQuery } from "../../reducers/api";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

const CreateVote = ({ questionId, submissionId }) => {
  const socket = io.connect("http://localhost:3000");
  socket.on("connect", () => {});

  const [createVote] = useCreateVoteMutation();
  const { voted } = useGetVotesForSubByUserQuery(submissionId);
  const user = useSelector((state) => state.auth.credentials.user);
  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive(!active);
  };
  useEffect(() => {
    async function findVote() {
      if (user && user.userId) {
        const req = await fetch(
          `/api/vote/voted/${submissionId}/${user.userId}`
        );
        const res = await req.json();
        if (res) {
          handleClick();
        }
      }
    }
    findVote();
  }, []);



  const onCreateVote = async () => {
    await createVote({ questionId, submissionId })
      .then(() => {
        console.log("create vote socket connected", socket.connected);
        socket.emit("new_vote", submissionId);
      })
      .catch(() => {
        console.log("error");
      });
  };

  return (
    <Fragment>
      <div
        onClick={function (event) {
          onCreateVote();
          handleClick();
        }}
        className="vote-button"
        style={{ color: active ? "#fa6b21" : null }}
      >
        <ThumbUpAltIcon />
      </div>
    </Fragment>
  );
};

export default CreateVote;
