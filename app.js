const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

// adstracting values out of the code to be more flexible
const cellsHorizontal = 8;
const cellsVertical = 5;
// gets the value of the viewable screen of the user
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    // shows the walls and shapes as outlines
    wireframes: false,
    width,
    height,
  },
});

Render.run(render);

Runner.run(Runner.create(), engine);

// ---- Walls ----

const walls = [
  // making use of the variables for the placements instead of fixed figures
  Bodies.rectangle(width / 2, 0, width, 3, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 3, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 3, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 3, height, { isStatic: true }),
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

const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));
/*
    Array(3) - create an empty array that has 3 possible places in it (has no elements)

    fill - adding a default value inside of the places in the array

    map - statement will run the inner function 3 times and each time we are going to
    generate a brand new and different array that has a default value of 'false'

    const grid = Array(3).fill([false, false, false]);
    -- this would look the same but all 3 arrays point to the same one, change one change them all
  */

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

// console.log(horizontals);

// Pick a random starting point
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
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
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      10,
      {
        isStatic: true,
        label: "wall",
        render: {
          fillStyle: "red",
        },
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
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      10,
      unitLengthY,
      {
        isStatic: true,
        label: "wall",
        render: {
          fillStyle: "red",
        },
      }
    );
    World.add(world, wall);
  });
});

// --- GOAL ---
// code for the goal to be displayed in the maze and the bottom ride corner
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  {
    isStatic: true,
    label: "goal",
    render: {
      fillStyle: "green",
    },
  }
);
World.add(world, goal);

// --- BALL ---

const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
// first two arguments to a circle is x and y coordinates of the circle
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: "ball",
  render: {
    fillStyle: "blue",
  },
});
World.add(world, ball);

// we are going to take the velocity of the ball and update is based on the key pressed
document.addEventListener("keydown", (event) => {
  // look at the current velocity of the ball - destructed into x and y variable
  const { x, y } = ball.velocity;

  // up key is pressed
  if (event.key === "w") {
    // this is how we update the velocity of a shape
    Body.setVelocity(ball, { x, y: y - 5 });
  }
  // right key is pressed
  if (event.key === "d") {
    Body.setVelocity(ball, { x: x + 5, y });
  }
  // down key is pressed
  if (event.key === "s") {
    Body.setVelocity(ball, { x, y: y + 5 });
  }
  // left key is pressed
  if (event.key === "a") {
    Body.setVelocity(ball, { x: x - 5, y });
  }
});

// --- Win Condition ---

Events.on(engine, "collisionStart", (event) => {
  // callback function - will be invoked when theres a collision between 2 different shapes
  // inside of our world

  // because the collision is retured as an array, we iterate over it to show what information
  // is shown from the collision
  event.pairs.forEach((collision) => {
    // console.log(collision);

    // add the labels we want to check collided into an array
    const labels = ["ball", "goal"];
    // use an if statement to check if either ball or goal is bodyA and the other is bodyB
    // which would mean the ball has collided with the goal
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector(".winner").classList.remove("hidden");
      world.gravity.y = 1;
      // iterate over the shapes in our world and change it the static to false so everything
      // falls down when the game has been won
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
