import { useEffect, useState } from "react";

import "./profile_pic.css";

interface ProfilePicType {
  url: string;
  size: string;
  userName: string;
}

function ProfilePic({ url, size, userName }: ProfilePicType) {
  const [color, setColor] = useState("red");

  useEffect(() => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    setColor(color);
  }, []);

  //Todo add logic for url to get image from cloud bucket
  return (
    <>
      {url === "" ? (
        <div className="profile-container">
          <div
            className="profile-pic no-pic"
            style={{
              backgroundColor: color,
              height: `${size}px`,
              width: `${size}px`,
              lineHeight: `${size}px`,
              padding: "1px",
            }}
          >
            {Array.from(userName)[0].toUpperCase()}
          </div>
          {userName}
        </div>
      ) : undefined}
    </>
  );
}

export default ProfilePic;
