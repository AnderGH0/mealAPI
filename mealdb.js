// Variables
const searchBtn = document.querySelector(".search-button");
const searchInput = document.querySelector(".search-input");
const searchResult = document.querySelector(".search-result");
const searchMeals = document.querySelector(".meals");
const title = document.createElement('h1');
const modal = document.querySelector(".modal");
const cross = document.querySelector(".cross")
const ingredientsList = document.querySelector(".modal-leftSide-ingredientList");

//events when pressing Enter or clicking the Search button
const searchClick = searchBtn.addEventListener("click", ()=>{
    const words = searchInput.value;
    if(words.trim()) displayMeals(words);
});
const searchEnter = searchInput.addEventListener("keyup", (e)=> {
    const words = searchInput.value;
    if(words.trim() && e.code === "Enter") displayMeals(words);
});

//displays the search result on screen
const displayMeals = async (words) =>{
    searchMeals.innerHTML = "";
    searchResult.style.display ="block"
    const mealsArray = await searchForMeals(words);
    addSearchTitle(words);
    createMealInstances(mealsArray);
}

//searches for meals 
const searchForMeals =async (words) =>{
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + words);
    const data = await response.json();
    return data.meals;
}

//creates and adds instances for the DOM
const createMealInstances =async (mealsArray) => {
    mealsArray.forEach(meal => {
        //create container
        const mealContainer = document.createElement("div");
        mealContainer.classList.add("meal-container")
        mealContainer.addEventListener("click", ()=> openModal(meal.strMeal));
        //create image
        const mealImage = document.createElement("img");
        mealImage.src= meal.strMealThumb;
        //create name
        const mealName = document.createElement("h2");
        mealName.textContent = meal.strMeal;
        //appends elemnts 
        mealContainer.appendChild(mealImage);
        mealContainer.appendChild(mealName);
        searchMeals.appendChild(mealContainer);
    });
}

//adds the title of the search
const addSearchTitle = (words) =>{
    title.innerHTML = `These are the results for: ${words}`
    searchResult.insertBefore(title, searchResult.firstChild);
} 

//-----------MODAL-----------------------------

//close modal
cross.addEventListener("click", ()=>{
    modal.style.display = "none"
})
//open modal
const openModal =async (name) =>{
    ingredientsList.innerHTML = "";
    modal.style.display = "grid"
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + name);
    const mealObj = await response.json();
    document.querySelector(".modal-leftSide-img").src = mealObj.meals[0].strMealThumb;
    document.querySelector(".modal-name").textContent = name;
    const instructions = mealObj.meals[0].strInstructions;   
    document.querySelector(".instructionsText").innerHTML = formatInstructions(instructions);
    appendIngredients(mealObj.meals[0]);
}

//appends ingredients list and quantities to the list
const appendIngredients = (obj) => {
    for(let i = 1; i <= 20; i++){
        const ingredientKey = `strIngredient${i}`;
        if(obj[ingredientKey]){
            const newIngredient = document.createElement("li");
            newIngredient.textContent = obj[ingredientKey];
            ingredientsList.appendChild(newIngredient);
        }
    }
}
//Format instructions
const formatInstructions = (instructions) =>{
    const text = instructions.split("\r\n").filter(el=> el)
    return text.join("<br>");  
}