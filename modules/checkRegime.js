function checkRegime(regime) {
  let isValid = true;
  const tabControle = [
    "sans gluten",
    "végétalien",
    "végétarien",
    "halal",
    "sans lactose",
  ];

  // If regime is a string we check the value with tabControle
  if (typeof regime === "string") {
    const value = tabControle.find((element) => element === regime);
    if (!value) {
      isValid = false;
    }
  }

  // If regime is an object we check the value with tabControle
  if (Array.isArray(regime) && regime.length > 0) {
    for (const key of regime) {
      const value = tabControle.find((element) => element === key);
      if (!value) {
        isValid = false;
      }
    }
  }

  return isValid;
}

module.exports = { checkRegime };
