var express = require('express');
var router = express.Router();

const Ingredient = require('../models/ingredients');
const { checkBody } = require('../modules/checkBody');


/* GET ingredient by id */
// ${URL}/ingredients/:id
 router.get('/:id', function(req, res) {
   if (!checkBody(req.params, ['id'])) {
     res.json({ result: false, error: 'Champ manquant ou vide' });
     return;
   }
  let id=Number(req.params.id)
   Ingredient.findById(id)
   .then((data)=> {
    if(data)
    {
      res.json({result:true,Ingredients : data});
    }
    else
    {
      res.json({result:false});
    }
     
   })
  
 });

 // ${URL}/ingredients/category/:category
router.get('/category/:category', function(req, res) {
  if (!checkBody(req.params, ['category'])) {
        res.json({ result: false, error: 'Champ manquant ou vide' });
        return;
      }

      let category=req.params.category.replace('-',' ')

  Ingredient.find({category : category})
  .then((data) => { 
    if (data)
    {
      console.log(data)
      res.json({result : true, data : data})
    }
    else
    {
      res.json({result : false,})
    }
    
  })

});

// ${URL}/ingredients/regime/:regime
router.get('/regime/:regime', function(req, res) {

  if (!checkBody(req.params, ['regime'])) {
    res.json({ result: false, error: 'Champ manquant ou vide' });
    return;
  }
  let regime = decodeURI(req.params.regime)
  regime=req.params.regime.replace('-',' ')
 
Ingredient.find({regime : regime})
.then((data) => { 
if (data)
{
 
  res.json({result : true, data : data})
}
else
{
  res.json({result : false,})
}

})

});

module.exports = router;
