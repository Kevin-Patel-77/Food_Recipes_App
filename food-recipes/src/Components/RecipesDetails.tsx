import { useParams } from "react-router-dom";
import { Box, CardMedia, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { fetchRecipesById } from "../Redux/Menu/RecipesApi";
import type { Recipe } from "../Redux/Menu/RecipesSlice";

const labelStyle = {
  listStyle: "none",
  fontSize: "18px",
  marginBottom: "16px",
  fontWeight: "bold",
  color: "var(--darkCrimson)",
};

const valueStyle = {
  listStyle: "none",
  fontSize: "18px",
  marginBottom: "16px",
  color: "black",
};

const RecipesDetails = () => {
  const { id } = useParams();
  const [foodInfo, setFoodInfo] = useState<Recipe | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const getFoodInfo = async () => {
      const res = await fetchRecipesById(id);
      setFoodInfo(res);
    };
    getFoodInfo();
  }, [id]);

  if (!foodInfo) {
    return <h1>Loadinggg.........</h1>;
  }

  return (
    <Box sx={{ padding: "1rem" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          gap: "32px",
        }}
      >
        <Box sx={{ textAlign: "center", color: "gold" }}>
          <CardMedia
            component="img"
            image={foodInfo.image}
            alt={foodInfo.name}
            sx={{
              border: "2px solid black",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "25rem",
            }}
          ></CardMedia>
          <Typography
            variant="h5"
            sx={{ marginTop: "16px", color: "var(--darkCrimson)" }}
          >
            {foodInfo.name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: "32px" }}>
          <Box>
            <Typography component={"ul"} sx={{ padding: 0 }}>
              <Typography sx={labelStyle} component={"li"}>
                {t("name")}:
              </Typography>
              <Typography sx={labelStyle} component={"li"}>
                {t("cuisine")}:
              </Typography>
              <Typography sx={labelStyle} component={"li"}>
                {t("prepTimeMinutes")}:
              </Typography>
              <Typography sx={labelStyle} component={"li"}>
                {t("cookTimeMinutes")}:
              </Typography>
              <Typography sx={labelStyle} component={"li"}>
                {t("ingredients")}:
              </Typography>
            </Typography>
          </Box>

          <Box>
            <Typography component={"ul"} sx={{ padding: 0 }}>
              <Typography sx={valueStyle} component={"li"}>
                {foodInfo.name}
              </Typography>
              <Typography sx={valueStyle} component={"li"}>
                {foodInfo.cuisine}
              </Typography>
              <Typography sx={valueStyle} component={"li"}>
                {foodInfo.prepTimeMinutes}
              </Typography>
              <Typography sx={valueStyle} component={"li"}>
                {foodInfo.cookTimeMinutes}
              </Typography>
              <Typography
                component="li"
                sx={{ ...valueStyle, paddingLeft: "16px" }}
              >
                <ul style={{ paddingLeft: "16px" }}>
                  {foodInfo.ingredients.map((ing, i) => (
                    <li key={i} style={{ marginBottom: "0.3rem" }}>
                      {ing}
                    </li>
                  ))}
                </ul>
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          marginTop: "80px",
          textAlign: "center",
          border: "1px solid black",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h4" sx={{ color: "var(--darkCrimson)" }}>
          {t("instruction")}
        </Typography>
        <Typography
          component="ul"
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "32px",
          }}
        >
          {foodInfo.ingredients.map((ingre, i) => (
            <Typography
              component="li"
              sx={{
                listStyle: "none",
                fontSize: "large",
                marginBottom: "0.5rem",
                color: "black",
              }}
              key={i}
            >
              {ingre}
            </Typography>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

export default RecipesDetails;
