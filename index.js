// -----------  MATTER.JS DEMO ---------------

// destructuring to get access to the following objects from the matter js library
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } =
  Matter;

const width = 800;
const height = 600;

// use engine to transition from our current state of our entire world into a new state
const engine = Engine.create(); // create a new engine
// get access to the 'world' that was create when we created a new engine
const { world } = engine;
// render object to actually show some content on the screen using a canvas element
const render = Render.create({
  // tell the render where we want to show our representation of world inside our html document
  element: document.body,
  // specify what engine to use
  engine: engine,
  // options object - the specs of the canvas element that will display all the content
  options: {
    // wireframes - to either show an outline of the shape or the shape filled with colour
    wireframes: false,
    // because the const has the same name, no need to write it out eg. width: width
    width,
    height,
  },
});

// tell the render object to start working and draw all our updates to the world onto the screen
Render.run(render);

// this is what coordinates the changes in state a to state b
Runner.run(Runner.create(), engine);

// adding mouse functionality to our world
World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas), // options object with a mouse property
  })
);

/*
// bodies object represents the ability to create shapes
// - first two numbers represent position in the world, x and y values (centre of the rectangle)
// - second two numbers represent the size of the shape, width and height
const shape = Bodies.rectangle(200, 200, 50, 50, {
  isStatic: true, // options object - isStatic means it will show but will never move
});

// world is a snapshot of all the shapes we have and makes it show up on our canvas
World.add(world, shape);
*/

// Walls
const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
  Bodies.rectangle(800, 300, 40, 600, { isStatic: true }),
];
World.add(world, walls);

// Random Shapes at different locations on the canvas

for (let i = 0; i < 30; i++) {
  if (Math.random() > 0.5) {
    World.add(
      world,
      Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
    );
  } else {
    World.add(
      world,
      Bodies.circle(Math.random() * width, Math.random() * height, 30, {
        render: {
          // changing the colour of the shape to a fixed colour
          fillStyle: "red",
        },
      })
    );
  }
}
