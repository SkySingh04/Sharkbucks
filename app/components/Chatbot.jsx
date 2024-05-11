'use client'
import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./chatbot.css";
import { v4 } from "uuid";
import { set } from "firebase/database";

const Chatbot = () => {
  const [msg, setMsg] = useState("");
  const [botresponse, setBotresponse] = useState([
    { message: "Hello, I am Alexa. How can I help you?", type: "bot" },
  ]);
  const [countflag, setCountflag] = useState(true);
  const [firstresp, setFirstresp] = useState(true);

  useEffect(() => {
    console.log(botresponse);
    // Add any other logic that depends on botresponse here
  }, [botresponse]);

  const handleClick = async () => {
    let flag = countflag ? 0 : 1;
    if (firstresp) {
      flag = 0;
      setFirstresp(false);
    }
    try {
      setBotresponse((prevBotresponse) => [
        ...prevBotresponse,
        { message: msg, type: "user" },
      ]);
      const response = await fetch(
        `https://9300-34-83-197-30.ngrok-free.app?user_id=hjhjhj&str=${msg}&type=${flag}`,
        {
          method: "GET",
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setMsg("");
      const data = await response.json();
      if (!data.message) {
        console.log("The category is:" + data.Category);
        console.log("The description is:" + data.Description);
        const uniqueid = v4();
        if (data.Category && data.Description) {
          await setDoc(doc(db, "helpdesk", uniqueid), {
            id: uniqueid,
            category: data.Category,
            description: data.Description,
            updatedAt: { seconds: Date.now() / 1000 },
            isSolved: false,
          });

          console.log("Data written");
        }
      }
      console.log("Recieved:" + data);

      // setBotresponse([...botresponse,data.message]);   data.message
      setBotresponse((prevBotresponse) => [
        ...prevBotresponse,
        { message: data.message ? data.message : "Query accepted", type: "bot" },
      ]);
      setCountflag(!countflag);
      console.log(botresponse);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
      <div className="chat-container">
        
        <div className="content">
          {botresponse.map((item, index) => {
            return item.type === "bot" ? (
              <div className="res" key={index}>
                
                <div className="msg">
                  <p>{item.message}</p>
                </div>
              </div>
            ) : (
              <div className="que" key={index}>
                
                <div className="uque">
                  <p>{item.message}</p>
                </div>
              </div>
            );
          })}
          <div className="enter-message">
            <input
              type="text"
              className="input"
              placeholder=""
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleClick();
                }
              }}
            />
            <button className="send-btn" onClick={handleClick}>
              Send
            </button>
          </div>
        </div>
      </div>
  );
};

export default Chatbot;
