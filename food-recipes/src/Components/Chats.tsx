import { Box, Button, Chip, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import api from "../Utils/axiosInstance/axiosInstance";
import { connectSocket, disconnectSocket } from "../Utils/Socket/socket";
import { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useMediaQuery, useTheme } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  sender: { id: string };
  content: string;
  createdAt: string;
  attachments?: { id: string; url?: string }[];
  type: "text" | "image";
}

const Chats = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const token = localStorage.getItem("accessToken");
  const loggedInUserId = token ? jwtDecode<{ sub: string }>(token).sub : null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const joinConversation = (anotherUserId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit("join_conversation", {
      anotherUserId,
    });
  };

  const sendMessage = async () => {
    if (!socketRef.current) return;
    if (!conversationId || !selectedUser) return;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const getFileId = await api.post(
        "/files/upload/signed-url",
        {
          filename: selectedFile.name,
          type: selectedFile.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(getFileId)

      await axios.put(getFileId.data.data.signedUrl, 
        selectedFile , 
        {
        headers: {
          "Content-Type": selectedFile.type,
        }});

      await api.post(
        `/files/${getFileId.data.data.fileId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      socketRef.current.emit("send_message", {
        conversationId,
        content: messageText,
        type: "image",
        attachments: [{ id: getFileId.data.data.fileId }],
      });

      setSelectedFile(null);
      setMessageText("");

      return;
    }

    if (!messageText.trim()) return;

    socketRef.current.emit("send_message", {
      conversationId,
      content: messageText,
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

    socket.on("receive_message", async (data) => {
      if (data.type === "image") {
        setMessages((prev) => [...prev, { ...data, url: data.attachments[0]?.url }]);
        return
      }

      setMessages((prev) => [...prev, data]);
    });

    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <>
      <Box>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              width: { xs: isSidebarOpen ? "100%" : "0%", sm: "35%", md: "25%", lg: "25%" },
              height: "100vh",
              border: "1px solid var(--jetGray)",
              display: "flex",
              flexDirection: "column",
              transition: "width 0.3s ease",
              overflow: "hidden",
            }}
          >
            <Typography variant="h4" sx={{ padding: "16px 24px" }}>
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
                    if (isXs) {
                      setIsSidebarOpen(false);
                    }
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
              width: { xs: isSidebarOpen ? "0%" : "100%", sm: "65%", md: "75%", lg: "75%" },
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              transition: "width 0.3s ease",
              overflow: "hidden",
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {isXs && (
                      <KeyboardBackspaceIcon onClick={() => setIsSidebarOpen(true)} sx={{ cursor: "pointer" }} />
                    )}
                    <Typography variant="h4">{selectedUser.name}</Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,

                    scrollbarWidth: "none",
                    msOverflowStyle: "none",

                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
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
                          backgroundColor: isMine ? (msg.type === "image" ? "none" :  "var(--softCrimson)") : (msg.type === "image" ? "none" :  "var(--jetGray)"),
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: "12px",
                          borderTopRightRadius: isMine ? 0 : "12px",
                          borderTopLeftRadius: isMine ? "12px" : 0,
                        }}
                      >
                        <Typography variant="body1">{msg.content}</Typography>

                        {msg.type === "image" && msg.attachments && msg.attachments[0].url && (
                          <Box sx={{ mt: 1 }}>
                            <img
                              src={msg.attachments[0].url}
                              alt="attachment"
                              style={{ maxWidth: "100%", borderRadius: "8px" }}
                            />
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                {selectedFile && (
                  <Chip label={selectedFile.name} onDelete={() => setSelectedFile(null)} sx={{ mb: 1 }} />
                )}

                <Box
                  sx={{
                    padding: "8px 16px",
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    flexShrink: 0,
                    margin: "10px",
                    marginBottom: "20px",
                    backgroundColor: "var(--white)",
                    borderRadius: "100px",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    type="text"
                    placeholder="Type a message"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box onClick={() => fileInputRef.current?.click()}>
                            <AttachFileIcon sx={{ cursor: "pointer" }} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
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
    </>
  );
};

export default Chats;
