
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
export async function getValueForDependency(equation) {
    // TODO: implement this correctly
    const equations = equation.split(/\band\b|\bor\b/i); // Split by 'and' or 'or'
    const values = await Promise.all(equations.map(equation => getEquationValue(equation)));
    return values.every(v => v);
}

// console.log(getValueForDependency('"list name"."list item" == "new" and "list 2"."item 2" != "old" or "list 3"."item 3" in [list 4, item 4]'));

async function getEquationValue(equation) {
  debugger;
  const operator = equation.match(/==|!=|\bin\b|<|<=|>|>=/ig)[0];
  const [item, stateValue] = equation.split(operator);
  const [listName, itemName] = item.split('.');

  const arrayMatches = stateValue.match(/\[(?<list>.*)\]/)
  let stateValueList = arrayMatches?.groups?.list;

  const listValues = await getUserListStates(listName.match(/['"](?<list>.*)['"]/).groups.list);

  const unquotedItemName = itemName.match(/['"](?<name>.*)['"]/).groups.name;
  const savedState = Object.entries(listValues).filter(([key, item]) => item.title === unquotedItemName)[0][1];

  if (!savedState) return false;

  const unquotedStateValue = stateValue.match(/['"](?<name>.*)['"]/).groups.name;

  switch (operator) {
    case '==' : return savedState.state_name == unquotedStateValue || savedState.value == unquotedStateValue;
    case '!=' : return savedState.state_name != unquotedStateValue || savedState.value != unquotedStateValue;
    case '<' : return savedState.state_name < unquotedStateValue || savedState.value < unquotedStateValue;
    case '>' : return savedState.state_name > unquotedStateValue || savedState.value > unquotedStateValue;
    case '<=' : return savedState.state_name <= unquotedStateValue || savedState.value <= unquotedStateValue;
    case '>=' : return savedState.state_name >= unquotedStateValue || savedState.value >= unquotedStateValue;
    case 'in' : return stateValueList.includes(savedState.state_name) || stateValueList.includes(savedState.value);
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

