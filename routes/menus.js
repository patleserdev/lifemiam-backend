var express = require("express");
var router = express.Router();

const Menu = require("../models/menus");
const { checkBody } = require("../modules/checkBody");
const User = require("../models/users");

const URL = "http://localhost:3000";

//LIST OF ALL MENU ROUTES:
// 1 route to create a menu, can optionnally add recipes; called in MenuTab and menu summary overlay
// POST/menus/new
// required: menuName and user token in req.body
// optional: recipeId, serving if not empty: add the recipe to the menu newly created

// 1 route to add a recipe to a menu, called in RecipeScreen or SearchScreen, can optionally create a menu if not existing in db
// PUT/menus/:menuId
//  required: user token in req.body, serving

// 1 route to list the menus of a user
// POST/menus
// required: user token in req.body

// Route pour créer un menu, nécéssite req.body.name et req.body.token
// ${URL}/menus/create
router.post("/create", (req, res) => {
  if(!checkBody(req.body,['token', 'name'])){
    res.json({ result: false, error: 'Champs manquants ou vides'});
    return;
  }

  User.findOne({ token: req.body.token }).then(user =>{
    if (user === null) {
      res.json({ result: false, error: 'Utilisateur inexistant'});
      return;
    }

    const newMenu = new Menu({
      name: req.body.name,
      owner: user._id
    })

    newMenu.save().then(newDoc => {
      res.json({ result: true, menu: newDoc})
    })
  })
});

// Ajouter une recette à un menu grâce à son id et son nombre de serving en req.body 
// ${URL}/menus/${menuId}/addRecipe
router.post("/:menuId/addRecipe", (req, res) => {
  
  const { recipeId, serving} = req.body;

  Menu.findById(req.params.menuId)
    .then(menu => {
      if(!menu){
        res.json({ result: false, error: 'Pas de menu trouvé'})
        return;
      }

      const newRecipe = {recipe: recipeId, serving};
      menu.menu_recipes.push(newRecipe);

      return menu.save();
    })
    .then(updateMenu => {
      res.json({result: true, menu: updateMenu})
    })
      
});

// Récupérer les menus 
// ${URL}/menus/getMenus
 router.post("/getMenus", function (req, res) {
  
  if(!req.body.token){
    res.json({result: false, error: 'Token manquant'})
 }

  User.findOne({token: req.body.token})
  .then(user => {
    if(user===null){
      res.json({ result: false, error: 'User not found'});
      return;
    }

    Menu.find({owner: user._id})
    .populate('menu_recipes.recipe')
    .then(menus =>{
      res.json(menus);
    });
  });
}); 

// Récupérer un seul menu par son id 
// ${URL}/menus/${menuId}
router.post("/:menuId", function (req,res){

  if(!req.body.token){
    res.json({result: false, error: 'Token manquant'})
  }

  User.findOne({token: req.body.token})
  .then(user => {
    if(user===null){
      res.json({result: false, error: 'user not found'})
      return;
    }

    Menu.findById(req.params.menuId)
      .populate('menu_recipes.recipe')
      .then(menu => {
        res.json({menu})
      });
  })
 
})

module.exports = router;
