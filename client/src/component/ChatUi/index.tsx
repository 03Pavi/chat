import {
  Box,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import "./index.css";
import { useEffect, useMemo, useState } from "react";
import { Message } from "../Messages";
import { io } from "socket.io-client";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface Message {
  id: number;
  text: string;
  sender: string;
}
const ChatUi = () => {
  const socket = useMemo(() => io("http://localhost:8082"), []);
  const [userId, setUserId] = useState("");
  const [input, setInput] = useState("");
  const [messageArray, setMessageArray] = useState<Message[]>([]);
  const [radioBtn, setradioBtn] = useState("broadcast");
  const [roomid, setRoomId] = useState("");
  const [personId, setPersonId] = useState("");
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setUserId(socket.id || "user Id");
    });
    socket.on("receive-message", ({ message, id }) => {
      const payload = {
        id: messageArray.length + 1,
        text: message.input,
        sender: socket.id == id ? "user" : "other",
      };
      setMessageArray((message) => [...message, payload]);
    });
  }, []);
  const handleSend = () => {
    if (input.trim() !== "") {
      if (personId) {
        const payload = {
          personId,
          input,
          radioBtn,
        };
        socket.emit("send-message", payload);
      } else if (roomid) {
        const payload = {
          roomid,
          input,
          radioBtn,
        };
        socket.emit("send-message", payload);
      } else {
        const payload = {
          input,
          radioBtn,
        };
        socket.emit("send-message", payload);
      }
      setInput("");
    }
  };
  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInput(event.target.value);
  };
  return (
    <Box component="div" className="chat-container">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "grey.200",
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
          {messageArray &&
            messageArray.map((message, index) => {
              console.log(message.text);
              return <Message key={index} message={message} />;
            })}
        </Box>
        <Box sx={{ p: 2, backgroundColor: "background.default" }}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            onChange={(e) => {
              setradioBtn(e.target.value);
            }}
          >
            <Box>
              <FormControlLabel
                value="oneToOne"
                control={<Radio />}
                label="one to one"
                name="radio"
              />
              {radioBtn.toLowerCase().includes("one") && (
                <TextField
                  id="outlined"
                  label="person id"
                  onChange={(e) => setPersonId(e.target.value)}
                />
              )}
            </Box>
            <Box>
              <FormControlLabel
                value="room"
                control={<Radio />}
                label="Room"
                name="radio"
              />
              {radioBtn.toLowerCase().includes("room") && (
                <>
                  <TextField
                    id="outlined"
                    label="room id"
                    onChange={(e) => setRoomId(e.target.value)}
                    disabled={toggle}
                  />
                  <button
                    onClick={() => {
                      socket.emit("join-room", roomid);
                      setToggle(!toggle);
                    }}
                  >
                    Join
                  </button>
                </>
              )}
            </Box>
            <p>
              {" "}
              Your Id: {userId}{" "}
              <button onClick={() => navigator.clipboard.writeText(userId)}>
                <ContentCopyIcon />
              </button>
            </p>
          </RadioGroup>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                size="small"
                fullWidth
                placeholder="Type a message"
                variant="outlined"
                value={input}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={2}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleSend}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatUi;
