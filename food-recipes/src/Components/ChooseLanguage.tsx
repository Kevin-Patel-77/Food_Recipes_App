import { Box, Button, Typography } from "@mui/material";
import {useEffect, type Dispatch, type SetStateAction } from "react";
import { setLanguage } from "../Redux/LanguageSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { i18n } from "@lingui/core";


type popUp = {
  setPopup: Dispatch<SetStateAction<boolean>>;
};

const ChooseLanguage: React.FC<popUp> = ({ setPopup }) => {

  const {lang} = useAppSelector((state)=> state.foodLanguage)
  const dispatch = useAppDispatch()

  useEffect(() => {
  import(`../locales/${lang}/messages.js`).then(mod => {
    i18n.load(lang, mod.messages);
    i18n.activate(lang);
  });

}, [lang]);

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
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>Choose a Language</Typography>
          <Typography variant="body2">Select your preferred language to use </Typography>
        </Box>

        <Box sx={{ display:"flex" , flexDirection:"column" , marginTop: "32px", marginBottom: "32px" }}>
          
          <Button onClick={()=> dispatch(setLanguage("en"))} sx={{ color: "#333333", "&:hover": { backgroundColor: "#EFE7E2", color: "black" }, padding: "8px 24px" , textAlign:'left'}}>English</Button>
          <Button onClick={()=> dispatch(setLanguage("fr"))} sx={{ color: "#333333", "&:hover": {  backgroundColor: "#EFE7E2", color: "black" }, padding: "8px 24px" }}>French</Button>
          <Button onClick={()=> dispatch(setLanguage("es"))} sx={{ color: "#333333", "&:hover": {  backgroundColor: "#EFE7E2", color: "black" }, padding: "8px 24px" }}>Spanish</Button>

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
