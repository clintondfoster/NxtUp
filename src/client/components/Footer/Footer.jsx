import React from "react";
import "./footer.scss";
const Footer = () => {
  return (
    <div className="footer">
      <div className="top">
      <p className="bigtext">Kast Your Vote</p>
      <p className="smallText">© Copyright 2023 Kast Your Vote. All rights reserved.</p>
      </div>
      <hr></hr>
      <ul className="list">
        <li>About</li>
        <li>How To Play?</li>
        <li>Privacy Policies</li>
      </ul>
    </div>
  );
};

export default Footer;
