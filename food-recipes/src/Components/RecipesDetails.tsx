import { useParams } from 'react-router-dom'
import { useAppSelector } from './hooks'

const RecipesDetails = () => {

    const { id } = useParams<{ id: string }>();
    const recipeId = Number(id);

    const { recipes } = useAppSelector((state) => state.foodrecipes)
    const foodInfo = recipes.find((res) => res.id == recipeId)

    if (!foodInfo) {
        return <h1 style={{ textAlign: "center" }}>Loading...</h1>;
    }

    return (
        <div>
            <div className='food-Info'>
                <div className='food-Info-img'>
                    <img src={foodInfo.image} alt={foodInfo.name} />
                    <h1>{foodInfo.name}</h1>
                </div>

                <div className='food-Details'>

                    <div className='food-prep-list'>
                        <ul>
                            <li>Name: </li>
                            <li>Cuisine: </li>
                            <li>PrepTimeMinutes: </li>
                            <li>CookTimeMinutes: </li>
                            <li>Food-Ingredients:</li>
                        </ul>
                    </div>

                    <div className='food-prep-list'>
                        <ul>
                            <li>{foodInfo.name}</li>
                            <li>{foodInfo.cuisine}</li>
                            <li>{foodInfo.prepTimeMinutes}</li>
                            <li>{foodInfo.cookTimeMinutes}</li>
                            <li>{foodInfo.ingredients.map((ingre) => (
                                <li>{ingre}</li>
                            ))}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='food-instruction'>
                <h1>INSTRUCTIONS</h1>
                <ul>
                    {foodInfo.ingredients.map((ingre, i) => (
                        <li key={i}>{ingre}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default RecipesDetails
