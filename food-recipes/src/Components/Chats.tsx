import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../Utils/axiosInstance/axiosInstance";

interface User {
  id: string;
  name: string;
}

const Chats = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            width: "25%",
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
              scrollbarWidth: "thin",
            }}
          >
            {userList.map((user) => (
              <Box
                key={user.id}
                onClick={() => setSelectedUser(user)}
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

        <Box sx={{ width: "75%" }}>
          {selectedUser ? (
            <Box>
              <Box sx={{ padding: "16px 24px", borderBottom: "1px solid var(--jetGray)" }}>
                <Typography variant="h4">{selectedUser.name}</Typography>
              </Box>

              <Box>
                <TextField type="search" placeholder="Type a message"></TextField>
                <Button>Send</Button>
              </Box>
            </Box>
          ) : (
            <Typography
              variant="h6"
              sx={{ height: "100vh", display: "grid", justifyContent: "center", alignItems: "center" }}
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
