function addIngredients(ingredients) {
    let count = [];
  
  //  console.log('ingredientsbefortransform',ingredients);
    let countKeys = Object.keys(count);
  //   console.log(countKeys);
  
    for (let ingredient of ingredients) 
    {
      const ingToFind = countKeys.find((e) => e === ingredient.name);

      if (!ingToFind) 
      {
      let quantity=0
      let recipes=[]

      ingredients.filter((e) => e.name === ingredient.name ? quantity+= e.quantity && recipes.push(e.recipe)  : null );
      
      count.push({
        name: ingredient.name , 
        quantity: quantity, 
        unit: ingredient.unit, 
        category:ingredient.category, 
        recipes: recipes,
        isBuyed:false,
      })
      countKeys.push(ingredient.name)

      }
    }
 
    return count
}

module.exports = { addIngredients };