import { BrowserMultiFormatReader } from '@zxing/browser';

const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const recipeElement = document.getElementById('recipe');

// Function to fetch a recipe from the backend
async function generateRecipe(title) {
    try {
        const response = await fetch('http://localhost:5000/generate-recipe', {
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

// Function to handle search button click
async function handleSearch() {
    const foodItem = searchInput.value.trim();
    
    if (!foodItem) {
        recipeElement.innerHTML = "Please enter a food item to search.";
        return;
    }

    // Fetch and display recipe
    const recipe = await generateRecipe(foodItem);
    recipeElement.innerHTML = `<h2>Recipe for ${foodItem}</h2><p>${recipe}</p>`;
}

// Attach event listener to search button
searchButton.addEventListener("click", handleSearch);
