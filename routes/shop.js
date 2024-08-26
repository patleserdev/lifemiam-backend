var express = require('express');
var router = express.Router();
const Shop = require("../models/shop")
const { checkBody } = require('../modules/checkBody');
const { addIngredients } = require("../modules/addIngredients");
const Menu = require("../models/menus");
const User = require("../models/users");


/** route permettant d'afficher une liste de course par id et token */
// ${URL}/shop/getlist/:menuId
router.post('/getlist/:menuId', async (req, res) => {
    const user = await User.findOne({ token: req.body.token })
    if (user === null) {
        res.json({ result: false, error: 'Utilisateur inexistant' });
        return;
    }
    Shop.findOne({menu : req.params.menuId})
    .then((data ) => {
        if(data)
        {
            res.json({result:true,id: data.id,data:data})
            console.log(data)
        }
        else
        {
            res.json({result:false,error: 'Pas de liste associée à ce menu'})
            console.log(data)
        }
        
        
    })
})

/** route permettant d'afficher une liste de course par id et token */
// ${URL}/shop/updatelist/:menuId
router.put('/updatelist/:menuId', async (req, res) => {
    const user = await User.findOne({ token: req.body.token })
    if (user === null) {
        res.json({ result: false, error: 'Utilisateur inexistant' });
        return;
    }
   
    Shop.findOneAndUpdate({menu : req.params.menuId},{Ingredients : req.body.ingredients} )

    .then((data ) => {
        if(data)
        {
            res.json({result:true,data:data})
            console.log(req.body.ingredients)        }
        else
        {
            res.json({result:false,error: 'Pas de liste associée à ce menu'})
            console.log(data)
        }
        
        
    })
})


// Route pour récupérer les ingrédients des recettes contenus dans un menu pour alimenter la liste de courses (ListScreen)
//pré requis: besoin d'un token pour obtenir le user_id et le menu_id, 
//token     wVL5sCx7YTgaO-fnxK5pX4mMG8JywAwQ
// menu    66b4953aac86d4086b49267a
// /shop/generate/
// ${URL}/shop/generate/:menuId
router.post('/generate/:menuId', async (req, res) => {
const user = await User.findOne({ token: req.body.token })
if (user === null) {
    res.json({ result: false, error: 'Utilisateur inexistant' });
    return;
}
// Rechercher le menu avec le menu_id
Menu.findById(req.params.menuId)
.populate({
    path: 'menu_recipes.recipe',
    populate:  { path: 'ing.ingredient'  }
  })
.then(menu => {
        if (!menu) 
        {
            res.json({ result: false, error: 'Pas de menu trouvé' })
            return;
        }
        if (menu) { 
            let ingredientsList=[]

            if (!menu.menu_recipes) 
            {
                res.json({ result: false, error: 'Pas de recettes trouvées' })
                return;
            }
            if(menu.menu_recipes)
            {
            for (recipe of menu.menu_recipes)
            {
                if (!recipe.recipe.ing) 
                {
                    res.json({ result: false, error: 'Pas d\'ingrédients trouvé' })
                    return;
                }
                if (recipe.recipe.ing) 
                {
 
                for (ingredient of recipe.recipe.ing)
                {
                   if (ingredient.ingredient)
                   {
                    ingredientsList.push(
                        {
                            name: ingredient.ingredient.name, 
                            unit: ingredient.ingredient.unit, 
                            quantity: ingredient.quantity*recipe.serving, 
                            category: ingredient.ingredient.category,
                            recipe:recipe.recipe._id
                        }
                        )
                   }
                  
                }
                }  
            }
        
            let list=addIngredients(ingredientsList)

            let shoplist= new Shop({
                user_id: user._id,
                menu: req.params.menuId,
                Ingredients:  list
            })
            shoplist.save().then(
                (data) => {
                    console.log(list)
                    res.json({ result: true,id: data.id, data: data })
                }
            )

          
        }
           
        }
    })




    /*
    *
    function groupsCount(users){
    let count = {};
  
    // Insert your code here
    let cities=[]
    
    users.filter((element) => cities.push(element.city))
    cities=cities.filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
  
    for(let city of cities)
    {
        users.filter((element,i) => element.city == city ? count[city]= count[city] === count[city] ? (count[city]) + 1 : null : null)
    }
    
 
    //console.log(cities)
    return count;
}
 
const usersExample = [
    {name: 'Pierre', city: 'Paris'},
    {name: 'Paul', city: 'Lyon'},
    {name: 'Jacques', city: 'Paris'},
    {name: 'Julie', city: 'Grenoble'},
    {name: 'Quentin', city: 'Orléans'},
    {name: 'Emma', city: 'Grenoble'}
];
console.log(JSON.stringify(groupsCount(usersExample)));
// Expected: {"Paris":2,"Lyon":1,"Grenoble":2,"Orléans":1}
**/



// // Nouvelle variable const ou let = []
// const recipes = Menu.recipes;
// let ingredientsList = [];

// //Boucler sur le tableau des recettes (FOR) 
// for (let i = 0; i < recipes.length; i++) {
//     const recipe = recipes[i].recipe;
//     recipe.ingredients.forEach(ingredient => {
//         //Récupérer les ingrédients de la recette []
//         //Pour chacun d'entre eux, récupérer le nom, l'unité, sa quantité et sa catégorie
//         //A la sortie, la réponse ressemblera à [{name: "pomme", unit: "unité", quantity: 3, category: "fruits"}]
//         ingredientsList.push({
//             name: ingredient.name,
//             unit: ingredient.unit,
//             quantity: ingredient.quantity,
//             category: ingredient.category,
//         });
//     });
//     console.log(ingredientsList)
// }

})

// router.get('/ingredients', async (req, res) => {
//     if (!checkBody(req.body, ['token', 'name'])) {
//         res.json({ result: false, error: 'Missing or empty fields' });
//         return;
//     }
// });

//comparer le user_id à l'owner du menu
// Menu.find({ owner: User._id, menu_id: Menu.id })
//     .populate('menu_recipes.recipe')
//     //SI l'user_id = owner je récupère les recettes du menu
//     .then(menus => {
//         res.json({ menus });
//     });



module.exports = router;
