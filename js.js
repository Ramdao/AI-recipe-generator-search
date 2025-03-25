import { BrowserMultiFormatReader } from '@zxing/browser';

const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const recipeElement = document.getElementById('recipe');

// Function to fetch a recipe from the backend
async function generateRecipe(title) {
    try {
        const response = await fetch('https://ai-receipe-generator.onrender.com/generate-recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });

        const data = await response.json();
        return data.recipe || "Recipe not found.";
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return "Failed to fetch recipe.";
    }
}

// Function to format and display the recipe
function displayRecipe(foodItem, recipeText) {
    // Extract title, ingredients, and instructions using regex
    const titleMatch = recipeText.match(/^(.*?) Recipe:/);
    const ingredientsMatch = recipeText.match(/Ingredients:\s*([\s\S]*?)Instructions:/);
    const instructionsMatch = recipeText.match(/Instructions:\s*([\s\S]*)/);

    const title = titleMatch ? titleMatch[1] : foodItem;
    const ingredients = ingredientsMatch ? ingredientsMatch[1].trim().split("\n- ").slice(1) : [];
    const instructions = instructionsMatch ? instructionsMatch[1].trim().split(/\d+\.\s/).slice(1) : [];

    // Format and display the recipe
    recipeElement.innerHTML = `
        <h2>${title}</h2>
        <h3>Ingredients:</h3>
        <ul>${ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>
        <h3>Instructions:</h3>
        <ol>${instructions.map(step => `<li>${step}</li>`).join("")}</ol>
    `;
}

// Function to handle search button click
async function handleSearch() {
    const foodItem = searchInput.value.trim();

    if (!foodItem) {
        recipeElement.innerHTML = "<p>Please enter a food item to search.</p>";
        return;
    }

    // Fetch and display the formatted recipe
    recipeElement.innerHTML = "<p>Loading recipe...</p>";
    const recipe = await generateRecipe(foodItem);
    displayRecipe(foodItem, recipe);
}

// Attach event listener to search button
searchButton.addEventListener("click", handleSearch);
