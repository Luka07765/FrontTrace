import React from 'react';

function ThrashCan() {
  let fruits = [['apple'], ['banana'], ['cherry']];
  let newList = [];
  let itemToMove = 'banana';

  // Find and remove the specified item from fruits
  let indexToRemove = fruits.findIndex((item) => item[0] === itemToMove);
  if (indexToRemove !== -1) {
    newList.push(fruits.splice(indexToRemove, 1)[0]);
  }

  console.log(fruits); // Output: [['apple'], ['cherry']]
  console.log(newList); // Output: [['banana']]

  return <div>ThrashCan</div>;
}

export default ThrashCan;
