function findNextAutocomplete(equation) {
  const equations = equation.split(/\band\b|\bor\b/i); // Split by 'and' or 'or'
  const lastEquation = equations.at(-1);
  const [item, stateValue] = lastEquation.split(/==|!=|in|<|<=|>|>=/ig);
  console.log({item, stateValue});
  const [listName, itemName] = item.split('.');
  if(stateValue) return stateValue;
  if(itemName) return itemName;
  if(listName) return listName;
  return equation;
}

export function getValueForDependency(equation) {
    // TODO: implement this correctly

    /**@type {string} */
    const equations = equation.split(/\band\b|\bor\b/i); // Split by 'and' or 'or'
    const lastEquation = equations.at(-1).trim();
    const operator = lastEquation.match(/==|!=|in|<|<=|>|>=/ig)?.[0];
    const [item, stateValue] = lastEquation.split(/==|!=|in|<|<=|>|>=/ig); // split by == != in < <= > >=
    const [listName, itemName] = item.split('.');

    return false; // fail by default

}

// // the equation in <list name/title>.<list item name/title> <evaluator> <value>

// // test the list name
// console.log(findNextAutocomplete("my_list"));
// // test the list name, in quotes
// console.log(findNextAutocomplete("'my list'"));
// // test the list item
// console.log(findNextAutocomplete("'my list'.'list_item'"));
// // test the list item value (state)
// console.log(findNextAutocomplete("'my list'.'list_item' == 'new'")); // should return 'new'

// console.log(findNextAutocomplete("'my list'.'list_item' == 'new' and 'list 2'.'item 2' != 'old'")); // should return 'old'

