const { Engine, Render, Runner, World, Bodies } = Matter;

// adstracting values out of the code to be more flexible
const cells = 3;
const width = 600;
const height = 600;

const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    // shows the walls and shapes as outlines
    wireframes: true,
    width,
    height,
  },
});

Render.run(render);

Runner.run(Runner.create(), engine);

// ---- Walls ----

const walls = [
  // making use of the variables for the placements instead of fixed figures
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];
World.add(world, walls);

// ---- Maze Generation ----

// function the shuffle the array passed into it
const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    // getting a random index location
    const index = Math.floor(Math.random() * counter);
    // decrease counter by 1
    counter--;
    // temp variable to hold the value at the position of counter inside of the array
    const temp = arr[counter];
    // swap the value at arr[counter] with the value at arr[index]
    arr[counter] = arr[index];
    // change the value in arr[index] with the temp value
    arr[index] = temp;
  }
  // return the array
  return arr;
};

const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));
/*
    Array(3) - create an empty array that has 3 possible places in it (has no elements)

    fill - adding a default value inside of the places in the array

    map - statement will run the inner function 3 times and each time we are going to
    generate a brand new and different array that has a default value of 'false'

    const grid = Array(3).fill([false, false, false]);
    -- this would look the same but all 3 arrays point to the same one, change one change them all
  */

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

// console.log(horizontals);

// Pick a random starting point
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

// define a function to call over and over using the startRow and startColumn and
// inside the function, we are going to go through the algorithm for checking if a cell
// has been visited or not
const stepThroughCell = (row, column) => {
  // -- If i have visited the cell at [row, column], then return
  if (grid[row][column] === true) {
    return;
  }
  // -- Mark this cell as being visited (true) - using the grid array
  grid[row][column] = true;
  // --  Assemble randomly-ordered list of neighbors
  const neighbours = shuffle([
    // neighbour above - string added to help determine which way was moved in algorithm
    [row - 1, column, "up"],
    // // neighbour to the right
    [row, column + 1, "right"],
    // // // neighbour below
    [row + 1, column, "down"],
    // // neighbour to the left
    [row, column - 1, "left"],
  ]);
  // -- For each neighbor...
  for (let neighbour of neighbours) {
    const [nextRow, nextColumn, direction] = neighbour;
    // -- See if that neighbour is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue;
    }
    // -- If we have visited that neighbour, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }
    // -- Remove a wall from either horizontals or verticals array
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }
    // -- Visit that next cell
    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startColumn);

// horizontals is a 2 dimensional array, when we do a forEach we will receive one of the inner
// arrays
// - first argument is what we are iterating over and the second argument is the index
horizontals.forEach((row, rowIndex) => {
  // second argument is the index of the column we are iterating over
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    // formula for the x and y coordinates
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      10,
      {
        isStatic: true,
      }
    );
    // add the drawing of the horizontal walls to the world
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      10,
      unitLength,
      {
        isStatic: true,
      }
    );
    World.add(world, wall);
  });
});

// code for the goal to be displayed in the maze and the bottom ride corner
const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.7,
  unitLength * 0.7,
  {
    isStatic: true,
  }
);
World.add(world, goal);
