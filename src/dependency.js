
import { getUserListStates } from './firebase';

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

/**
 *
 * @param {string} equation
 * @returns {boolean}
 */
export function getValueForDependency(equation) {
    // TODO: implement this correctly
    const equations = equation.split(/\band\b|\bor\b/i); // Split by 'and' or 'or'
    return equations.every(equation => getEquationValue(equation));

}

// console.log(getValueForDependency('"list name"."list item" == "new" and "list 2"."item 2" != "old" or "list 3"."item 3" in [list 4, item 4]'));

async function getEquationValue(equation) {
  const operator = equation.match(/==|!=|\bin\b|<|<=|>|>=/ig)[0];
  const [item, stateValue] = equation.split(operator);
  const [listName, itemName] = item.split('.');

  const arrayMatches = stateValue.match(/\[(?<list>.*)\]/)
  let stateValueList = arrayMatches?.groups?.list;

  // call firebase and get the values here
  const listValues = await getUserListStates(listName)
  console.log(operator, stateValue, stateValueList, listValues);
  const savedState = listValues.find(item => item.title === itemName);

  if (!savedState) return false;

  switch (operator) {
    case '==' : return savedState.value == stateValue;
    case '!=' : return savedState.value != stateValue;
    case '<' : return savedState.value < stateValue;
    case '>' : return savedState.value > stateValue;
    case '<=' : return savedState.value <= stateValue;
    case '>=' : return savedState.value >= stateValue;
    case 'in' : return stateValueList.includes(savedState.value);
    default: return false;
  }

  return savedState && item.value == statevalue;
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

