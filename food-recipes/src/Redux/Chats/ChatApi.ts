import api from "../../Utils/axiosInstance/axiosInstance";

interface GetSignedUrlPayload {
  file: File;
  token: string | null;
}


interface confirmFileUploadPayload {
  fileId: string;
  token: string | null;
}

export const getFileId = async ({ file, token }: GetSignedUrlPayload) => {
  try {
    const res = await api.post(
      "/files/upload/signed-url",
      {
        filename: file.name,
        type: file.type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data.data;
  } catch (error) {
    console.log("Error in getting signed URL:", error);
    throw error;
  }
};

export const uploadFileToSignedUrl = async (
  signedUrl: string,
  selectedFile: File,
) => {
  try {
    await api.put(signedUrl, selectedFile, {
      headers: {
        "Content-Type": selectedFile.type,
      },
    });
  } catch (error) {
    console.log("Error in uploading file to signed URL:", error);
    throw error;
  }
};

export const confirmFileUpload = async ({
  fileId,
  token,
}: confirmFileUploadPayload) => {
  try {
    const res = await api.post(
      `/files/${fileId}/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log("Error in confirming file upload:", error);
    throw error;
  }
};
