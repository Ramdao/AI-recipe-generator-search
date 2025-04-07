import { BrowserMultiFormatReader } from '@zxing/browser';

const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const recipeElement = document.getElementById('recipe');

searchInput.placeholder = "Banana Bread";


recipeElement.innerHTML = `<h2> Generating Recipe for: Banana Bread</h2>
<h3>Ingredients:</h3>
<ul>
  <li>3 ripe bananas (mashed)</li>
  <li>1/3 cup melted butter</li>
  <li>3/4 cup sugar</li>
  <li>1 egg (beaten)</li>
  <li>1 tsp vanilla extract</li>
  <li>1 tsp baking soda</li>
  <li>Pinch of salt</li>
  <li>1 1/2 cups all-purpose flour</li>
</ul>

<h3>Instructions:</h3>
<ol>
  <li>Preheat oven to 350°F (175°C). Grease a 4x8 inch loaf pan.</li>
  <li>In a large bowl, mash the bananas with a fork until smooth.</li>
  <li>Stir in the melted butter.</li>
  <li>Mix in the sugar, egg, and vanilla extract.</li>
  <li>Sprinkle the baking soda and salt over the mixture and mix in.</li>
  <li>Add the flour and stir until just combined.</li>
  <li>Pour the batter into the prepared loaf pan.</li>
  <li>Bake for 50–60 minutes, or until a toothpick inserted into the center comes out clean.</li>
  <li>Let it cool in the pan for a few minutes, then remove to a wire rack to cool completely.</li>
</ol>
        `;


// Function to fetch a recipe from the backend
async function fetchAndDisplayRecipe(title) {
    searchInput.placeholder = "Enter Food Name";
    recipeElement.innerHTML = "<p>Loading recipe...</p>"
    try {
        const response = await fetch('https://ai-receipe-generator.onrender.com/generate-recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });

        const data = await response.json();
        displayRecipe(title, data.recipe || "Recipe not found.");
    } catch (error) {
        console.error("Error fetching recipe:", error);
        displayRecipe(title, "Failed to fetch recipe.");
    }
}

// Function to format and display the recipe
function displayRecipe(foodItem, recipeText) {
    // Extract the title (first line)
    const lines = recipeText.trim().split("\n");
    const title = lines[0].trim();  

    // Extract ingredients and instructions using regex
    const ingredientsMatch = recipeText.match(/Ingredients:\s*([\s\S]*?)Instructions:/);
    const instructionsMatch = recipeText.match(/Instructions:\s*([\s\S]*)/);

    const ingredients = ingredientsMatch ? ingredientsMatch[1].trim().split("\n- ").slice(1) : [];
    const instructions = instructionsMatch ? instructionsMatch[1].trim().split(/\d+\.\s/).slice(1) : [];

    // Format and display the recipe
    recipeElement.innerHTML = `
        <h2> Generating Recipe for: ${foodItem}</h2>
        <h3>Ingredients:</h3>
        <ul>${ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>
        <h3>Instructions:</h3>
        <ol>${instructions.map(step => `<li>${step}</li>`).join("")}</ol>
        <button id="refreshRecipe">Get New Recipe</button>
    `;

    // Add event listener to refresh button
    document.getElementById("refreshRecipe").addEventListener("click", () =>  fetchAndDisplayRecipe(foodItem));
}

// Function to handle search button click
async function handleSearch() {
    const foodItem = searchInput.value.trim();

    if (!foodItem) {
        recipeElement.innerHTML = "<p>Please enter a food item to search.</p>";
        return;
    }

    // Fetch and display the formatted recipe
    // recipeElement.innerHTML = "<p>Loading recipe...</p>";
    const recipe = await fetchAndDisplayRecipe(foodItem);
    displayRecipe(foodItem, recipe);
}

// Attach event listener to search button
searchButton.addEventListener("click", handleSearch);
