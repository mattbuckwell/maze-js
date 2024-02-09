const { Engine, Render, Runner, World, Bodies } = Matter;

// adstracting values out of the code to be more flexible
const cells = 3;
const width = 600;
const height = 600;

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
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
];
World.add(world, walls);

// ---- Maze Generation ----

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
// console.log(startRow, startColumn);

// define a function to call over and over using the startRow and startColumn and
// inside the function, we are going to go through the algorithm for checking if a cell
// has been visited or not
const stepThroughCell = (row, column) => {
  // If i have visited the cell at [row, column], then return
  // Mark this cell as being visited (true) - using the grid array
  // Assemble randomly-ordered list of neighbors
  // For each neighbor...
  // See if that neighbour is out of bounds
  // If we have visited that neighbour, continue to next neighbor
  // Remove a wall from either horizontals or verticals array
  // Visit that next cell
};

stepThroughCell(startRow, startColumn);
