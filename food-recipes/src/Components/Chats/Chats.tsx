import {
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { connectSocket, disconnectSocket } from "../../Utils/Socket/socket";
import { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useMediaQuery, useTheme } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useAppDispatch, useAppSelector } from "../hooks";
import { chatsHistory, fetchUserList } from "../../Redux/Chats/ChatThunk";
import {
  addConversation,
  clearConversations,
  type Messages,
  type User,
  
  
} from "../../Redux/Chats/ChatSlice";
import { ChatSkeleton } from "../Skeleton/ChatsSkeleton";
import HlsVideoPlayer from "../../Utils/HlsVideoPlayer/HlsVideoPlayer";
import CircularProgress from "@mui/material/CircularProgress";
import {
  sendMediaMessage,
  sendTextMessage,
  sendVideoMessage,
} from "./sendMessages";

const Chats = () => {
  const dispatch = useAppDispatch();

  const { userList, conversations, page, loading, hasMore } = useAppSelector(
    (state) => state.foodChats,
  );

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const chatsPerPage = 20;

  const [isVideoPending, setIsVideoPending] = useState<boolean>(false);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const token = localStorage.getItem("accessToken");
  const loggedInUserId = token ? jwtDecode<{ sub: string }>(token).sub : null;

  const joinConversation = (anotherUserId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit("join_conversation", {
      anotherUserId,
    });
  };

  const sendMessage = async () => {
    if (!socketRef.current) return;
    if (!conversationId || !selectedUser) return;

    const sendArgs = {
      chatSocket: socketRef.current,
      conversationId,
      token,
      content: messageText,
    };

    if (selectedFile) {
      if (selectedFile.type.startsWith("video")) {
        await sendVideoMessage(sendArgs, selectedFile, setIsVideoPending);
      } else {
        await sendMediaMessage(sendArgs, selectedFile);
      }
    } else {
      sendTextMessage(sendArgs);
    }

    setMessageText("");
    setSelectedFile(null);
  };

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(
      `${import.meta.env.VITE_SOCKET_TOKEN_PREFIX} ${token}`,
    );
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on(
      "joined",
      (data: { conversationId: string; messages: Messages[] }) => {
        dispatch(clearConversations());
        setConversationId(data.conversationId);
        dispatch(
          chatsHistory({
            limit: chatsPerPage,
            page: 1,
            conversationId: data.conversationId,
          }),
        );
      },
    );

    socket.on("receive_message", (data) => {
      if (data) {
        const SSE_URL = `${import.meta.env.VITE_SSE_NOTIFICATION_EVENTS}`;
        const eventSource = new EventSource(SSE_URL);

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (
            data.status == "SENT" &&
            data.conversationId != conversationId &&
            data.senderId != loggedInUserId
          ) {
            alert("Hey You have a message");
          }
        };
      }

      dispatch(addConversation(data));
    });

    return () => {
      disconnectSocket();
    };
  }, [token, conversationId, loggedInUserId, dispatch]);

  // Chats Scrolling
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollTop === 0 && !isFetchingRef.current && hasMore && !loading) {
        isFetchingRef.current = true;

        dispatch(
          chatsHistory({
            conversationId,
            limit: chatsPerPage,
            page,
          }),
        ).finally(() => {
          isFetchingRef.current = false;
        });
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [conversationId, page, hasMore, loading, dispatch]);

  return (
    <>
      <Box>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              width: {
                xs: isSidebarOpen ? "100%" : "0%",
                sm: "35%",
                md: "25%",
                lg: "25%",
              },
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
                    backgroundColor:
                      selectedUser?.id === user.id
                        ? "var(--softCrimson)"
                        : "transparent",
                    color:
                      selectedUser?.id === user.id
                        ? "var(--white)"
                        : "var(--jetGray)",
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
              width: {
                xs: isSidebarOpen ? "0%" : "100%",
                sm: "65%",
                md: "75%",
                lg: "75%",
              },
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
                      <KeyboardBackspaceIcon
                        onClick={() => setIsSidebarOpen(true)}
                        sx={{ cursor: "pointer" }}
                      />
                    )}
                    <Typography variant="h4">{selectedUser.name}</Typography>
                  </Box>
                </Box>

                <Box
                  ref={chatContainerRef}
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
                  {loading &&
                    Array.from({ length: chatsPerPage }).map((_, i) => (
                      <ChatSkeleton
                        key={`skeleton-${i}`}
                        align={i % 2 === 0 ? "left" : "right"}
                      />
                    ))}

                  {conversations.map((msg) => {
                    const isMine = msg.sender.id == loggedInUserId;
                    const isMedia = msg.type === "media";

                    return (
                      <Box
                        key={msg.id}
                        sx={{
                          alignSelf: isMine ? "flex-end" : "flex-start",
                          maxWidth: "60%",
                          backgroundColor: isMine
                            ? isMedia
                              ? "none"
                              : "var(--softCrimson)"
                            : isMedia
                              ? "none"
                              : "var(--jetGray)",
                          color: isMedia
                            ? isMine
                              ? "var(--softCrimson)"
                              : "var(--jetGray)"
                            : "var(--white)",
                          padding: "8px 16px",
                          borderRadius: "12px",
                          borderTopRightRadius: isMine ? 0 : "12px",
                          borderTopLeftRadius: isMine ? "12px" : 0,
                        }}
                      >
                        {!isMedia && (
                          <Typography variant="body1">{msg.content}</Typography>
                        )}

                        {isMedia &&
                          msg.attachments &&
                          msg.attachments.map((att) => {
                            switch (att.mediaType) {
                              case "image":
                                return (
                                  <Box key={att.id} sx={{ mt: 1 }}>
                                    <img
                                      src={att.url}
                                      alt="attachment/image"
                                      style={{
                                        maxWidth: "100%",
                                        borderRadius: "12px",
                                      }}
                                    ></img>
                                  </Box>
                                );

                              case "video":
                                return (
                                  <Box key={att.id} sx={{ mt: 1 }}>
                                    <HlsVideoPlayer videoId={att.media.id} />
                                  </Box>
                                );

                              case "audio":
                                return (
                                  <Box key={att.id} sx={{ mt: 1 }}>
                                    <audio src={att.url} controls />
                                  </Box>
                                );

                              case "application":
                                return (
                                  <Box
                                    key={att.id}
                                    sx={{
                                      p: 1,
                                      backgroundColor: isMine
                                        ? "var(--softCrimson)"
                                        : "var(--jetGray)",
                                      color: "var(--white)",
                                      borderRadius: "8px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      window.open(att.url, "_blank")
                                    }
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{ wordBreak: "break-all" }}
                                    >
                                      {"Attachment"}
                                      <Typography
                                        sx={{ mt: 1, fontSize: "10px" }}
                                      >
                                        click to open
                                      </Typography>
                                    </Typography>
                                  </Box>
                                );

                              default:
                                return null;
                            }
                          })}
                      </Box>
                    );
                  })}
                </Box>

                {isVideoPending && (
                  <Box
                    sx={{
                      alignSelf: "flex-end",
                      maxWidth: "60%",
                      padding: "16px",
                      borderRadius: "12px",
                      backgroundColor: "var(--softCrimson)",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  </Box>
                )}

                {selectedFile && (
                  <Chip
                    label={selectedFile.name}
                    onDelete={() => setSelectedFile(null)}
                    sx={{ mb: 1 }}
                  />
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
                    multiple
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
