import { Box, Button, Typography } from "@mui/material";
import { type Dispatch, type SetStateAction } from "react";
import { useAppDispatch } from "./hooks";
import { setLanguage } from "../Redux/LanguageSlice";

type popUp = {
  setPopup: Dispatch<SetStateAction<boolean>>;
};

const ChooseLanguage: React.FC<popUp> = ({ setPopup }) => {
  const dispatch = useAppDispatch();


  const changeLang = (lang : "en" | "fr" | "es") =>{
    dispatch(setLanguage(lang))
    setPopup(false)
  }


  return (
    <Box
      sx={{
        position: "fixed",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        zIndex: "999",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ padding: "48px", backgroundColor: "white", width: "38%", height: "38%", borderRadius: "50px" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Choose a Language
          </Typography>
          <Typography variant="body2">Select your preferred language to use </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", marginTop: "32px", marginBottom: "32px" }}>
          <Button onClick={() => changeLang("en")} sx={{ color: "#333333", "&:hover": { backgroundColor: "#EFE7E2", color: "black" }, padding: "8px 24px"}}>English </Button>
          <Button onClick={() => changeLang("fr")} sx={{ color: "#333333", "&:hover": { backgroundColor: "#EFE7E2", color: "black" }, padding: "8px 24px" }}>French</Button>
          <Button onClick={() => changeLang("es")} sx={{ color: "#333333", "&:hover": { backgroundColor: "#EFE7E2", color: "black" }, padding: "8px 24px" }}>Spanish</Button>
        </Box>

        <Box sx={{ textAlign: "right", marginRight: "32px" }}>
          <Button variant="contained" onClick={() => setPopup(false)}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChooseLanguage;
