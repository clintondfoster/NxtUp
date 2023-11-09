import "./Notifications.scss";
import React from "react";
// import { Notifications } from "react-push-notification";
import addNotification from "react-push-notification";

const NotificationsComp = () => {
  const buttonClick = () => {
    addNotification({
      // title: "New Question created in your group!"
      // subtitle
    });
  };
  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
    </div>
  );
};

export default NotificationsComp;
