let formulaText;
let formulaInput;
let formulaButton;
let formulaDisplay;
let tokenDisplay;

let parsedTree;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);

  formulaText = createElement('h2', 'Formula : ');
  formulaText.position(20, 5);

  formulaInput = createInput();
  formulaInput.position(135, 30);

  formulaButton = createButton('submit');
  formulaButton.position(formulaInput.x + formulaInput.width + 5, 30);

  formulaDisplay = createElement('h3');
  formulaDisplay.position(20, 35);

  tokenDisplay = createElement('h4');
  tokenDisplay.position(20, 65);

  formulaButton.mousePressed(sendFormula);
}

function sendFormula() {
  let displayFormula = "Expression: ";
  let displayToken = "Tokens: ";
  let lexemes;

  let formula = formulaInput.value();
  if (!formula || formula === "") return;

  try {
    lexemes = lexicalAnalysys(formula);
    console.log(lexemes);

    let tree = new Node();
    parsedTree = buildTreeParser(lexemes, tree);
    // console.table(lexemes);
    console.log(parsedTree);

    displayFormula += `${formula}`;
    displayToken += `${lexemes.map(lex => { return lex.type; }).join(' ')}`;
  } catch (error) {
    displayFormula += error;
  }

  formulaDisplay.html(`${displayFormula}`);
  tokenDisplay.html(`${displayToken}`);
  // console.log(JSON.stringify(parsedTree, null, 2));
}

/**
 * 
 * @param {number} x1 X coordinate of the parent node
 * @param {number} x2 x coordinates of the current node
 * @returns calculated x
 */
function middlePoint(x1, x2) {
  return (x1 + x2) / 2;
}

function drawNode(value, x, y) {
  circle(x, y, 30);
  text(value, x - 3, y + 4);
}

function drawLines(x, y, lX, rX, yy) {
  // draw line only for debbug
  stroke("magenta")
  line(x, y, lX, yy)
  stroke("green")
  line(x, y, rX, yy)
  stroke("black")
}

function drawDuadicNode(tree, x, y, newY, xO) {
  let leftX;
  let rightX;
  let middle;
  let lastX = xO;

  // we are computing the first coordinates of the childrens
  if (x !== xO) {

  }

  if (x === xO) {
    middle = windowWidth / 10;
    leftX = x - middle;
    rightX = x + middle;


  } else {
    middle = middlePoint(x, xO);
    delta = x - middle;
    leftX = x - delta;
    rightX = x + delta;

    xO = x;
  }

  drawLines(x, y, leftX, rightX, newY)
  drawNode(tree.operator, x, y)

  drawTree(tree.firstOperand, leftX, newY, x);
  drawTree(tree.secondOperand, rightX, newY, x);
}

function drawMonadicNode(tree, x, y, newY, xO) {
  stroke("red")
  line(x, y, x, newY)
  stroke("black")
  drawNode(tree.operator, x, y)
  drawTree(tree.value, x, newY, x);
}

/**
 * If we are a Node we compute the next x coordinates
 * 
 * We need to find the half distance between the current Node and the previous Node
 * that way we can compute the delta needed to get the new points
 * 
 * We don't need y in the calculation since both Nodes will have the same height
 * 
 * Let delta a number in a range [0, windowWidth] => delta = (currentX + parentX) / 2
 * With delta calculated we can define x1 and x2
 * 
 *   y0 --------- N
 *               /|\
 *              / | \
 *             /  |  \
 *            /   |   \
 *   y1 --- x1   xN    x2
 * 
 * In order to define the correct delta we need to have the information about the position of the current Node
 * depending of the parent's position i.e. we will not take the same arguments if it is right or left
 * 
 * @param {import("../tree").Node} tree 
 * @param {number | null} x the x coordinate of the parent Node
 * @param {number | null} y the y coordinate of the parent Node
 * @param {number | null} xO the x coordinate of the parent of the parent Node
 */
function drawTree(tree, x, y, xO) {
  if (!x && !y) {
    x = int(windowWidth / 2);
    y = int(windowHeight / 7);
    xO = x;
  }

  const newY = int(y + (windowHeight / 7));

  if (tree instanceof Monadic || tree instanceof Group) {
    drawMonadicNode(tree, x, y, newY, xO)
  } else if (tree instanceof Duadic) {
    drawDuadicNode(tree, x, y, newY, xO);
  } else if (tree instanceof Variable) {
    drawNode(tree.value, x, y);
  }
}

function draw() {
  background(220);
  if (parsedTree) {
    drawTree(parsedTree);
  }
}


function drawTreeDump(tree, x1, y1, xOrigin) {
  if ((!x1 && !y1)) {
    x1 = windowWidth / 2;
    y1 = int(windowHeight / 7);
  }

  let rightX;
  let leftX;

  stroke("blue");
  fill('blue');
  text(`x:${x1},y:${y1}xOrigin:${xOrigin}`, x1, y1 - 30);

  const yy = int(y1 + (windowHeight / 7));
  let delta;
  if (x1 <= windowWidth / 2) {
    rightX = x1 + (x1 / 2);
    leftX = x1 / 2;
  } else {
    // delta = (windowWidth + x1) / 2;
    if (!xOrigin) {
      delta = (windowWidth + x1) / 2;
    } else {
      delta = (xOrigin + x1) / 2;
    }

    rightX = x1 + delta;
    leftX = x1 - delta;
  }
  stroke('magenta');
  fill("magenta");
  line(x1, y1, delta, yy);

  // text(`x:${x1},y:${y1}`, x1, y1 - 30)
  text(`x: ${leftX}, y: ${y1}xOrigin: ${xOrigin}`, delta, yy + 30)
  // console.log(`x1: ${x1},y1: ${y1},xOrigine: ${xOrigin},leftX: ${leftX},rightX: ${rightX},yy: ${yy}`);

  stroke('green');
  line(x1, y1, x1 + (delta / 2), yy);

  if (tree.value || tree.operator) {
    fill('white')
    circle(x1, y1, 30);
    fill('black')
    text(tree.value ?? tree.operator, x1 - 4, y1 + 4)
  }
  if (tree.firstOperand && tree.secondOperand) {
    drawTree(tree.firstOperand, delta, yy, x1);
    drawTree(tree.secondOperand, rightX, yy, x1);
  }

  return;
}