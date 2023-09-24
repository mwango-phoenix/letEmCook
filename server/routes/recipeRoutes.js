const { render } = require("ejs");
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// App Routes - list all pages to link to recipe controller
router.get("/", recipeController.homepage);
router.get("/categories", recipeController.byCategory);
router.get("/categories/:id", recipeController.categoryById);
router.get("/recipe/:slug", recipeController.exploreRecipes);
router.get("/edit/:id", recipeController.editRecipe);
router.post("/search", recipeController.searchRecipe);
router.get("/explore-recent", recipeController.recentRecipes);
router.get("/random", recipeController.getRandom);
router.get("/submit", recipeController.addRecipe);
router.post("/submit", recipeController.submitRecipe);
router.get("/map", recipeController.worldMap);
router.delete("/recipe/:id", recipeController.deleteRecipe);
module.exports = router;
