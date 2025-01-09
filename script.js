const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const recipePopup = document.querySelector('.recipe-popup');


// Function to get recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "Fetching Recipes...";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
    
        recipeContainer.innerHTML = "";
        if (response.meals) {
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="Recipe Image">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea} Dish</span></p>
                    <p><span>Belongs to ${meal.strCategory}</span></p>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);
    
                // Adding event listener to recipe button
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });
    
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = "No recipes found!";
        }
        
    } catch (error) {
    recipeContainer.innerHTML = "Fetching Recipes...";
    }
};

// Function to fetch ingredients
const fetchIngredients = (meal) => {
    let ingredientList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientList;
};

// Function to open recipe popup
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p >${meal.strInstructions}</p>
        </div>
    `
    recipeDetailsContent.parentElement.style.display = "block";
};


// Event listener for search button
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display= "none"; // Hide the popup
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the meal in the serach box</h2>`;
        return;
    }
    fetchRecipes(searchInput);
});
