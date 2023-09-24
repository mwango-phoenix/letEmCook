// Add text input for ingredients
let addIngredientsBtn = document.getElementById("addIngredientsBtn");
let ingredientList = document.querySelector(".ingredientList");
let ingredientDiv = document.querySelectorAll(".ingredientDiv")[0];

if (addIngredientsBtn) {
  addIngredientsBtn.addEventListener("click", function () {
    let newIngredients = ingredientDiv.cloneNode(true);
    let input = newIngredients.getElementsByTagName("input")[0];
    input.value = "";
    ingredientList.appendChild(newIngredients);
  });
}

// Add text input for instructions
let addStepBtn = document.getElementById("addStepBtn");
let instructionList = document.querySelector(".instructionList");
let instructionDiv = document.querySelectorAll(".instructionDiv")[0];

if (addStepBtn) {
  addStepBtn.addEventListener("click", function () {
    let newStep = instructionDiv.cloneNode(true);
    let input = newStep.getElementsByTagName("input")[0];
    input.value = "";
    instructionList.appendChild(newStep);
  });
}

// remove text input for ingredients
let rmvIngredientsBtn = document.getElementById("rmvIngredientsBtn");

if (rmvIngredientsBtn) {
  rmvIngredientsBtn.addEventListener("click", function () {
    ingredientList.removeChild(ingredientList.lastElementChild);
  });
}

// remove text input for instructions
let rmvStepBtn = document.getElementById("rmvStepBtn");

if (rmvStepBtn) {
  rmvStepBtn.addEventListener("click", function () {
    instructionList.removeChild(instructionList.lastElementChild);
  });
}

////////////////////////////////////////
//functions for updating recipe
/////////////////////////////////////

// Render ingredients
function renderIngredients() {
  let html = "";

  recipe.ingredients.forEach((ing, index) => {
    html += `
      <div class="ingredient">
                <input name="ingredients[]" value=${ing}>
                <button type="button" class="btn btn-delete" onclick="deleteIngredient(${index})">X</button>
              </div>
    `;
  });

  // Insert HTML into page
  document.querySelector(".ingredient-list").innerHTML = html;
}

function deleteIngredient(index) {
  // Filter out ingredient at index
  recipe.ingredients = recipe.ingredients.filter((_, i) => i !== index);

  // Re-render ingredients
  renderIngredients();
}

// Add text input for ingredients
let addIngBtn = document.getElementById("addIngBtn");
let ingList = document.querySelector(".ingredient-list");
let ingDiv = document.querySelectorAll(".ingredient")[0];

if (addIngBtn) {
  addIngBtn.addEventListener("click", function () {
    let newIng = ingDiv.cloneNode(true);

    let input = newIng.getElementsByTagName("input")[0];
    input.value = "";

    ingList.appendChild(newIng);
  });
}

//remove input for ingredients
let rmvIngBtn = document.getElementById("rmvIngBtn");
if (rmvIngBtn) {
  rmvIngBtn.addEventListener("click", function () {
    let ingredients = document.querySelectorAll(".ingredient");
    if (ingredients.length > 1) {
      ingredients[ingredients.length - 1].remove();
    }
  });
}

// Render instructions
function renderInstructions() {
  let html = "";

  recipe.instructions.forEach((step, index) => {
    html += `
      <div class="instruction">
                <input name="instructions[]" value=${step}>
                <button type="button" class="btn btn-delete" onclick="deleteStep(${index})">X</button>
              </div>
    `;
  });

  // Insert HTML into page
  document.querySelector(".instruction-list").innerHTML = html;
}

function deleteStep(index) {
  // Filter out step at index
  recipe.instructions = recipe.instructions.filter((_, i) => i !== index);

  // Re-render steps
  renderInstructions();
}

// Add text input for instructions
let addStep = document.getElementById("addStep");
let insList = document.querySelector(".instruction-list");
let insDiv = document.querySelectorAll(".instruction")[0];

if (addStepBtn) {
  addStepBtn.addEventListener("click", function () {
    let newStep = insDiv.cloneNode(true);
    let input = newStep.getElementsByTagName("input")[0];
    input.value = "";
    insList.appendChild(newStep);
  });
}

//remove instruction
let rmvInsBtn = document.getElementById("rmvInsBtn");
if (rmvInsBtn) {
  rmvInsBtn.addEventListener("click", function () {
    let instructions = document.querySelectorAll(".instruction");
    if (instructions.length > 1) {
      instructions[instructions.length - 1].remove();
    }
  });
}
