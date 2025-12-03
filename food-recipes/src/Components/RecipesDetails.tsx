import { useParams } from 'react-router-dom'
import { useAppSelector } from './hooks'
import { Box, CardMedia, Typography } from '@mui/material'

const labelStyle = {
  listStyle: "none",
  fontSize: "1.1rem",
  marginBottom: "1rem",
  fontWeight: "bold",
  color: "gold",
};

const valueStyle = {
  listStyle: "none",
  fontSize: "1.1rem",
  marginBottom: "1rem",
  color: "white",
};

const RecipesDetails = () => {

    const { id } = useParams<{ id: string }>();
    const recipeId = Number(id);

    const { recipes } = useAppSelector((state) => state.foodrecipes)
    const foodInfo = recipes.find((res) => res.id == recipeId)

    if (!foodInfo) {
        return <h1 style={{ textAlign: "center" }}>Loading...</h1>;
    }

    return (
    <Box sx={{ padding: "1rem" }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "center", gap: '2rem', marginLeft: { xs: "0rem", md: "15rem", lg: "35rem" } }}>
        <Box sx={{ textAlign: "center", color: "gold" }}>
          <CardMedia component="img" image={foodInfo.image} alt={foodInfo.name} sx={{ border: "2px solid black", borderRadius: "10px", width: "100%", maxWidth: "25rem" }}></CardMedia>
          <Typography variant='h4' sx={{ marginTop: "1rem" }}>{foodInfo.name}</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: "2rem" }}>

          <Box>
            <Typography component={"ul"} sx={{ padding: 0 }}>
              <Typography sx={labelStyle} component={"li"}>Name: </Typography>
              <Typography sx={labelStyle} component={"li"}>Cuisine: </Typography>
              <Typography sx={labelStyle} component={"li"}>PrepTimeMinutes: </Typography>
              <Typography sx={labelStyle} component={"li"}>CookTimeMinutes: </Typography>
              <Typography sx={labelStyle} component={"li"}>Food-Ingredients:</Typography>
            </Typography>
          </Box>

          <Box>
            <Typography component={"ul"} sx={{ padding: 0 }}>
              <Typography sx={valueStyle} component={"li"}>{foodInfo.name}</Typography>
              <Typography sx={valueStyle} component={"li"}>{foodInfo.cuisine}</Typography>
              <Typography sx={valueStyle} component={"li"}>{foodInfo.prepTimeMinutes}</Typography>
              <Typography sx={valueStyle} component={"li"}>{foodInfo.cookTimeMinutes}</Typography>
              <Typography component="li" sx={{ ...valueStyle, paddingLeft: "1rem" }}>
                <ul style={{ paddingLeft: "1rem" }}>
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

      <Box sx={{ marginTop: "2rem", marginLeft: { sm: "0rem", md: "15rem", lg: "35rem" }, textAlign: "center", border: "1px solid black", backdropFilter: "blur(10px)", borderRadius: "10px" }}>
        <Typography variant='h4' sx={{ color: "gold" }}>INSTRUCTION</Typography>
        <Typography component="ul">
          {foodInfo.ingredients.map((ingre, i) => (
            <Typography component="li" sx={{ listStyle: "none", fontSize: "large", marginBottom: "0.5rem" }} key={i}>{ingre}</Typography>
          ))}
        </Typography>
      </Box>
    </Box>
  )
}

export default RecipesDetails
