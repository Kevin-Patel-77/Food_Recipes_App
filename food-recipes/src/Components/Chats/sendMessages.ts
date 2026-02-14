import { Socket } from "socket.io-client";
import {
  confirmFileUpload,
  getFileId,
  uploadFileToSignedUrl,
} from "../../Redux/Chats/ChatApi";
import api from "../../Utils/axiosInstance/axiosInstance.ts";
import { toast } from "react-toastify";

interface sendArgs {
  chatSocket: Socket | null;
  conversationId: string | null;
  content: string;
}

export interface sendArgsWithToken extends sendArgs {
  token: string | null;
}

export const sendTextMessage = ({
  chatSocket,
  conversationId,
  content,
}: sendArgs) => {
  chatSocket?.emit("send_message", {
    conversationId,
    content,
    type: "text",
  });
};

export const sendMediaMessage = async (
  { chatSocket, conversationId, content, token }: sendArgsWithToken,
  file: File,
) => {
  const getFile = await getFileId({ file, token });

  // Upload file to supabase
  await uploadFileToSignedUrl(getFile.signedUrl, file);

  // Confirm upload
  await confirmFileUpload({ fileId: getFile.fileId, token });

  chatSocket?.emit("send_message", {
    conversationId,
    content,
    type: "media",
    attachments: [
      {
        media: { id: getFile.fileId },
        mediaType: file?.type.split("/")[0],
        mimeType: file?.type,
      },
    ],
  });
};

export const sendVideoMessage = async (
  { chatSocket, conversationId, content, token }: sendArgsWithToken,
  file: File,
  onPendingChange?: (v: boolean) => void,
) => {
  if (!chatSocket || !conversationId || !token) return;

  onPendingChange?.(true);

  const formData = new FormData();
  formData.append("file", file);

  const eventSource = new EventSource(import.meta.env.VITE_SSE_VIDEO_EVENTS);

  try {
    await api.post("/video/upload", formData, {
      headers: {
        Authorization: `${import.meta.env.VITE_SOCKET_TOKEN_PREFIX} ${token}`,
      },
    });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.status === "ACTIVE") {
        chatSocket.emit("send_message", {
          conversationId,
          content,
          type: "media",
          attachments: [
            {
              media: { id: data.videoId },
              mediaType: "video",
              mimeType: file.type,
            },
          ],
        });

        onPendingChange?.(false);
        eventSource.close();
      } else{
        toast.error("Failed to load video")
        onPendingChange?.(false);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      onPendingChange?.(false);
      eventSource.close();
    };
  } catch {
    onPendingChange?.(false);
    eventSource.close();
  }
};
