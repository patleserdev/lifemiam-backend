var express = require("express");
var router = express.Router();

const Recipe = require("../models/recipes");


const Recipe2 = require("../models/recipescopy");
const Ingredient = require("../models/ingredients");
// const Ingredient2 = require("../models/ingredientscopy");

const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

const uid2 = require('uid2');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// ${URL}/admin/all
router.get("/all", function (req, res, next) {
    Recipe.find({})
    .then((data)=>{
      res.json({result:true,data})
    })
  })


/*
* route d'edition pour pouvoir editer les images
*/
// ${URL}/admin/addpicture
router.post("/addpicture", async (req, res) => {
    const uniqid = uid2(16);
    const photoPath = `./tmp/${uniqid}.jpg`;
  
  
     const resultMove = await req.files.file.mv(photoPath);
  
    // Récupérer les datas
    // Ajouter l'image a cloudinary
    if (!resultMove) 
    {
        const resultCloudinary = await cloudinary.uploader.upload(photoPath);
        fs.unlinkSync(photoPath);
        res.json({ result: true, url: resultCloudinary.secure_url });  
    } 
    else 
    {
        res.json({ result: false, error: resultMove });
    }
  })


  /*
  * édition de la recette 
  */
  // ${URL}/admin/edit
  router.put("/edit", async (req, res) => {

    if (req.body.image.includes('cloudinary'))
    {
      cloudinary.uploader.destroy(req.body.image)
    }

  
    Recipe.updateOne({_id: req.body.id}, {$set: {
      id:req.body.id,
      name:req.body.name,
      tags:req.body.tags,
      regime:req.body.regime,
      default_serving:req.body.default_serving,
      difficulty:req.body.difficulty,
      time:req.body.time,
      popularity:req.body.popularity,
      image:req.body.image}}).
      then((data)=>
      {
        res.json(data)
      })
  })


  /*
  * route qui permet de transformer les ingrédients en string d'une recette en objectIds
  */

 // Je vais chercher une recette par son id
 // ${URL}/admin/transformallrecipes/:id
  router.get("/transformrecipe/:id", async (req, res) => {

    // Est-ce que mon id est correctement renseignée ?
    if (!req.params.id) {
      return res.json({ result: false, error: "Champs d'identification manquants ou vides" });
    }
  
    // Est-ce que mon id correspond à une recette de la db ?
    try {
      const recipe = await Recipe2.findById(req.params.id);
      if (!recipe) {
        return res.json({ result: false, error: 'Recette introuvable' });
      }
  
      // Promise.all et map pour traiter tous les ingrédients en parallèle
        // pour chaque ingrédient je cherche un ingrédient correspondant dans ingredient2
      const updatedIngredients = await Promise.all(recipe.ing.map(async (ingredient) => {
        const foundIngredient = await Ingredient.findOne({
          name: { $regex: new RegExp(`\\b${ingredient.ingredient}\\b`, "gi") }
          // name: { $regex: new RegExp(`^${ingredient.ingredient}$`, "i") }
          
        });
  
        //Si je trouve un ingrédient correspondant, je créé un objet qui mélange l'ingrédient original
        //et le nouvel ID de l'ingrédient trouvé, sinon je ne modifie rien
        if (foundIngredient) {
          console.log(foundIngredient,' Trouvé')
          return {
            ...ingredient.toObject(),
            _id: foundIngredient._id,
            
          };
        }
        else
        {
          console.log(foundIngredient,' Non trouvé')
        }
        return ingredient;
      }));
  
      //je remplace la liste d'ingrédient par la nouvelle, puis je save
      recipe.ing = updatedIngredients;
      await recipe.save();
  
      // Je vérifie si tout s'est bien passé
      res.json({ result: true, data: recipe });
    } catch (error) {
      console.error('Erreur lors de la transformation de la recette : ', error);
      res.status(500).json({ result: false, error: 'Erreur interne du serveur' });
    }
  });

  /*
  * route qui permet de transformer les ingrédients en string d'une recette en objectIds
  */

 // Je vais chercher une recette par son id
 // ${URL}/admin/transformallrecipes/
 router.get("/transformallrecipes/", async (req, res) => {

  // Est-ce que mon id est correctement renseignée ?

  // Est-ce que mon id correspond à une recette de la db ?
  try {
    const recipe = await Recipe2.find();
    if (!recipe) {
      return res.json({ result: false, error: 'Recette introuvable' });
    }


    for(let onerecipe of recipe)
    {
    // console.log(onerecipe.name) 
    // Promise.all et map pour traiter tous les ingrédients en parallèle
    // Pour chaque ingrédient je cherche un ingrédient correspondant dans ingredient2
    
    const updatedIngredients = await Promise.all(onerecipe.ing.map(async (ingredient) => {

      if (typeof ingredient == String)
      {
      const foundIngredient = await Ingredient.findOne({
        name: { $regex: new RegExp(`\\b${ingredient.ingredient}\\b`, "gi") }
        // name: { $regex: new RegExp(`\\b${ingredient.ingredient}\\b`, "i") }
      });

      // Si je trouve un ingrédient correspondant, je créé un objet qui mélange l'ingrédient original
      // et le nouvel ID de l'ingrédient trouvé, sinon je ne modifie rien
      if (foundIngredient) {
        return {
          ...ingredient.toObject(),
          _id: foundIngredient._id
        };
      }
      else
      {
console.log('Non trouvé',foundIngredient)
      }
      return ingredient;
      }
    }));

    // Je remplace la liste d'ingrédient par la nouvelle, puis je save
    recipe.ing = updatedIngredients;
    await onerecipe.save();
  }
    // Je vérifie si tout s'est bien passé
    res.json({ result: true, data: recipe });
  } catch (error) {
    console.error('Erreur lors de la transformation de la recette : ', error);
    res.status(500).json({ result: false, error: 'Erreur interne du serveur' });
  }
});

  module.exports = router;
