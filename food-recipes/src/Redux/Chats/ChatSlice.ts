import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chatsHistory, fetchUserList } from "./ChatThunk";

export type MessageType = "text" | "media";

export type MediaType = "image" | "video" | "audio" | "application";

export interface Attachment {
  id: string;
  url: string;
  mediaType: MediaType;
  mimeType: string;
}

export interface Messages {
  id: string;
  sender: { id: string };
  content: string;
  createdAt: string;
  attachments?: Attachment[];
  type: MessageType;
}

export interface User {
  id: string;
  name: string;
}

export interface initialStatetype {
  loading: boolean;
  userList: User[]
  conversations: Messages[];
  page:number
  error: string | null;
}

export const initialState: initialStatetype = {
  loading: false,
  userList: [],
  conversations: [],
  page:1,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addConversation(state , action:PayloadAction<Messages>){
      state.conversations.push(action.payload)
    },
    addManyConversations(state , action:PayloadAction<Messages[]>){
      state.conversations = [...action.payload]
    },
    clearConversations(state){
      state.conversations = []
    }
  },
  extraReducers: (builder)=>{
    builder

    // Fetch Users List
    .addCase(fetchUserList.pending, (state)=>{
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchUserList.fulfilled , (state , action)=>{
        state.loading = false;
        state.userList = action.payload;
    })
    .addCase(fetchUserList.rejected , (state , action)=>{
        state.loading = false;
        state.error = action.payload || "SomeThing went wrong"
    })

    // Fetch Chats History
    .addCase(chatsHistory.pending , (state)=>{
      state.loading = true
      state.error = null
    })
  }
});

export const {addConversation , addManyConversations , clearConversations} = chatSlice.actions

export default chatSlice.reducer;
