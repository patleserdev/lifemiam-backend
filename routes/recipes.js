var express = require("express");
var router = express.Router();

const Recipe = require("../models/recipes");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

const URL = "http://localhost:3000";

const uid2 = require("uid2");

//LIST OF ALL MENU ROUTES:

// 1 route to get recipes based on multiple criteria: popularity, limit, search input, tags
// GET/recipes/?search="crepe"&tags="lactose-free"&sortBy=popularity
// required: user token in req.body
//or array=["foo","bar"] puis JSON.parse()
// optional: recipeId, serving if not empty: add the recipe to the menu newly created

// ${URL}/recipes/all
router.get("/all", (req, res) => { 
  Recipe.find().then((data) =>
  {
    res.json({result: true, data});
  })
});

// GET one recipe to display
// ${URL}/recipes/:recipeId/:token
router.get("/:recipeId/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((user) => {
    // console.log(req.query);
    if (user === null) {
      res.json({ result: false, error: "Utilisateur introuvable" });
    }
    return;
  });

  Recipe.findById(req.params.recipeId)
    // .populate("_id", ["name", "unit", "_id"])
    .populate("ing.ingredient")
    .then((data) => {
      console.log("response", data);
      // console.log("populate", data.ing.ingredient);
      data
        ? res.json({ result: true, data })
        : res.json({ result: false, error: "Recette introuvable" });
    });
});

/* GET recipes listing with parameters. */
// ${URL}/recipes/
router.get(
  "/",
  function (req, res) {
    const { sortBy = "popularity", search = "", tags } = req.query;
    let queryFilters = {};
    console.log("req.query:", req.query);
    if (req.query.tags) {
      let tags_parse = JSON.parse(req.query.tags);

      if (Array.isArray(tags_parse) && tags_parse.length > 0) {
        queryFilters.tags = { $all: tags_parse };
      }
    }

    console.log("queryFilters:", queryFilters);
    if (search) {
      const decodedSearch = decodeURIComponent(search);
      queryFilters.name = { $regex: new RegExp(decodedSearch, "gi") };
    }

    Recipe.find(queryFilters, ["_id", "name", "image", "popularity", "time"], {
      sort: {
        [sortBy]: -1,
      },
    }).then((data) => {
      data.length > 0
        ? res.json({ result: true, count: data.length, data })
        : res.json({ result: false, error: "Impossible de trouver des recettes populaires" });
    });
    return;
  }

  // TO-DO
  // gerer les accents dans la recherche
  // gerer les whitespaces : hyphens? +?
);

module.exports = router;
