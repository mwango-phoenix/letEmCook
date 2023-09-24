require("../models/database");
const { isBuffer } = require("util");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

/**
 * GET /
 * Homepage
 */

//request and response
exports.homepage = async (req, res) => {
  try {
    //database query to grab categories
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    //get latest recipes
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);

    //get recipes of certain category
    const drinks = await Recipe.find({ category: "Drinks" }).limit(limitNumber);
    const breakfast = await Recipe.find({ category: "Breakfast" }).limit(
      limitNumber
    );

    const recent = { latest, drinks, breakfast };

    //render index page and display categories
    res.render("index", { title: "My Recipes - Home", categories, recent });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories
 * Categories
 */
exports.byCategory = async (req, res) => {
  try {
    //database query to grab categories
    const limitNumber = 30;
    const categories = await Category.find({}).limit(limitNumber);

    //render index page and display categories
    res.render("categories", { title: "View Recipes by Category", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories/:id
 * Recipes of a Category
 */
exports.categoryById = async (req, res) => {
  try {
    // Get category Id from URL parameter
    const categoryId = req.params.id;

    const page = req.query.page || 1; // Get the requested page from query parameters
    const recipesPerPage = 20; // Number of recipes to display per page

    const totalRecipes = await Recipe.countDocuments({ category: categoryId });
    //count number of pages required
    const totalPages = Math.ceil(totalRecipes / recipesPerPage);

    const skipAmount = (page - 1) * recipesPerPage;

    const recipesInCategory = await Recipe.find({ category: categoryId })
      .skip(skipAmount)
      .limit(recipesPerPage);

    // Pass pagination information to the template
    res.render("categoryById", {
      title: "Recipes by Category",
      categoryByTag: recipesInCategory,
      currentPage: parseInt(page),
      totalPages: totalPages,
      categoryId: categoryId,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

/**
 * GET /recipe/:slug
 * Recipes page
 */
exports.exploreRecipes = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ slug: req.params.slug });
    //render index page and display categories
    res.render("recipe", { title: "Recipe page", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 * Search for recipe
 */
exports.searchRecipe = async (req, res) => {
  try {
    // get search phrase
    let searchTerm = req.body.searchTerm;
    let recipeFind = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Search Results", recipeFind });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-recent
 * Find most recently added
 */
exports.recentRecipes = async (req, res) => {
  try {
    const page = req.query.page || 1; // Get the requested page from query parameters
    const recipesPerPage = 20; // Number of recipes to display per page

    const totalRecipes = await Recipe.countDocuments({});
    //count number of pages required
    const totalPages = Math.ceil(totalRecipes / recipesPerPage);

    const skipAmount = (page - 1) * recipesPerPage;
    const recipeList = await Recipe.find({})
      .sort({ _id: -1 })
      .skip(skipAmount)
      .limit(recipesPerPage);

    //render index page and display categories
    res.render("explore-recent", {
      title: "Recently Added",
      currentPage: parseInt(page),
      recipeList,
      totalPages,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /random
 * Return Random recipe
 */
exports.getRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    //render index page and display categories
    res.render("random", { title: "Recently Added", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /submit
 * Add new recipe to database
 */
exports.addRecipe = async (req, res) => {
  try {
    // Errors to display to user
    const errorObj = req.flash("infoErrors");
    // Success messages
    const submitObj = req.flash("infoSubmit");
    //render index page and display categories
    res.render("submit", { title: "Add New Recipe", errorObj, submitObj });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * Post /submitRecipe
 * Submit new recipe
 */
exports.submitRecipe = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }
    // Add data
    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      servingSize: req.body.servingSize,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    //render index page and display categories
    res.redirect("/submit");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/submit");
  }
};

// GET /edit/:id
// exports.editRecipe = async (req, res) => {
//   try {
//     // const recipe = await Recipe.findOne({ slug: req.params.slug });
//     const recipeId = await Recipe.findOne( { _id: req.params.id });
//     res.render("edit", { title: "Edit Recipe", recipeId });
//   } catch (error) {
//     res.status(500).send({ message: error.message || "Error Occurred" });
//   }
// };

exports.updateRecipe = async (req, res) => {
  try {
    // Get recipe to update
    let recipe = await Recipe.findById(req.params.id);

    // Handle image upload
    let imageUploadFile;
    if (req.files && req.files.image) {
      imageUploadFile = req.files.image;
      recipe.image = imageUploadFile.name;
      // save uploaded image
    }

    // Update recipe fields
    recipe.name = req.body.name;
    recipe.description = req.body.description;
    recipe.ingredients = req.body.ingredients;
    recipe.instructions = req.body.instructions;
    recipe.category = req.body.category;

    // Save updated recipe
    await recipe.save();

    req.flash("infoSubmit", "Recipe has been updated");
    res.redirect("/recipes/" + recipe._id);
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect(`/edit/${req.params.id}`);
  }
};

exports.editRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  res.render("edit", { recipe });
};

exports.deleteRecipe = async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.redirect("/");
};

exports.updateRecipe = async (req, res) => {
  const { name, ingredients, instructions } = req.body;

  const recipe = await Recipe.findById(req.params.id);

  recipe.name = name;
  recipe.ingredients = ingredients;
  recipe.instructions = instructions;

  await recipe.save();

  res.redirect(`/recipes/${recipe._id}`);
};

/**
 * GET /map
 * World Map display
 */
exports.worldMap = async (req, res) => {
  try {
    res.render("map", { title: "World Map" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// async function updateRecipe() {
//   try {
//     const res = await Recipe.updateOne({name: ''}, {name: ''});
//     res.n // number of docs matching
//     res.nModified; //number of docs modified
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function deleteRecipe() {
//   try {
//     await Recipe.deleteOne({name: ''});

//   } catch (error) {
//     console.log(error);
//   }
// }

// //insert data to database
// async function insertDummyCategoryData() {
//   try {
//     // data to insert
//     await Category.insertMany([
//       {
//         name: "Breakfast",
//         image: "breakfast.jpg",
//       },
//       {
//         name: "Lunch",
//         image: "lunch.jpg",
//       },
//       {
//         name: "Dinner",
//         image: "dinner.jpg",
//       },
//       {
//         name: "Dessert",
//         image: "desserts.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log("err", +error);
//   }
// }

// insertDummyCategoryData();
