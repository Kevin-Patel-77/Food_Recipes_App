import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../Utils/axiosInstance/axiosInstance";
import { connectSocket, disconnectSocket } from "../Utils/Socket/socket";
import { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  sender: {id : string}
  content: string;
  createdAt: string;
}

const Chats = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState("");

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const socketRef = React.useRef<Socket | null>(null);

  const token = localStorage.getItem("accessToken");
  const loggedInUserId = token ? jwtDecode<{ sub: string }>(token).sub : null;

  const joinConversation = (anotherUserId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit("join_conversation", {
      anotherUserId,
    });
  };

  const sendMessage = () => {
    if (!socketRef.current) return;
    if (!conversationId || !selectedUser) return;
    if (!messageText.trim()) return;

    socketRef.current.emit("send_message", {
      conversationId,
      content: messageText,
      receiverId: selectedUser.id,
      type: "text",
    });

    setMessageText("");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user");
        setUserList(res.data.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(`Bearer ${token}`);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("joined", (data: { conversationId: string; messages: Message[] }) => {
      setConversationId(data.conversationId);
      setMessages(data.messages);
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      disconnectSocket();
    };
  }, [token]);   

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            width: "20%",
            height: "100vh",
            border: "1px solid var(--jetGray)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" sx={{ padding: "16px 24px", flexShrink: 0 }}>
            Chats
          </Typography>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",

              "&::-webkit-scrollbar": {
                width: "6px",
              },

              "&::-webkit-scrollbar-track": {
                backgroundColor: "#EFE7E2",
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#999",
                borderRadius: "10px",
                minHeight: "16px",
              },

              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#777",
              },
            }}
          >
            {userList.map((user) => (
              <Box
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  joinConversation(user.id);
                }}
                sx={{
                  cursor: "pointer",
                  backgroundColor: selectedUser?.id === user.id ? "var(--softCrimson)" : "transparent",
                  color: selectedUser?.id === user.id ? "var(--white)" : "var(--jetGray)",
                }}
              >
                <Typography variant="h6" sx={{ padding: "16px 24px" }}>
                  {user.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            width: "80%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedUser ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  padding: "16px 24px",
                  borderBottom: "1px solid var(--jetGray)",
                  flexShrink: 0,
                }}
              >
                <Typography variant="h4">{selectedUser.name}</Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {messages.map((msg) => {
                  const isMine = msg.sender.id == loggedInUserId;

                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        alignSelf: isMine ? "flex-end" : "flex-start",
                        maxWidth: "60%",
                        backgroundColor: isMine ? "var(--softCrimson)" : "var(--jetGray)",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "12px",
                        borderTopRightRadius: isMine ? 0 : "12px",
                        borderTopLeftRadius: isMine ? "12px" : 0,
                      }}
                    >
                      <Typography variant="body1">{msg.content}</Typography>
                    </Box>
                  );
                })}
              </Box>

              <Box
                sx={{
                  padding: "16px 32px",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <TextField
                  fullWidth
                  type="search"
                  placeholder="Type a message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button onClick={sendMessage}>Send</Button>
              </Box>
            </Box>
          ) : (
            <Typography
              variant="h6"
              sx={{
                flex: 1,
                display: "grid",
                placeItems: "center",
              }}
            >
              Select a user to start chatting
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Chats;
