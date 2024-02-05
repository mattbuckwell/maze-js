// destructuring to get access to the following objects from the matter js library
const { Engine, Render, Runner, World, Bodies } = Matter;

// use engine to transition from our current state of our entire world into a new state
const engine = Engine.create(); // create a new engine
// get access to the 'world' that was create when we created a new engine
const { world } = engine;
// render object to actually show some content on the screen
const render = Render.create({
  // tell the render where we want to show our representation of world inside our html document
  element: document.body,
  // specify what engine to use
  engine: engine,
  // options object - the specs of the canvas element that will display all the content
  options: {
    width: 800,
    height: 600,
  },
});

// tell the render object to start working and draw all our updates to the world onto the screen
Render.run(render);

// this is what coordinates the changes in state a to state b
Runner.run(Runner.create(), engine);

// bodies object represents the ability to create shapes
const shape = Bodies.rectangle(200, 200, 50, 50, {
  isStatic: true, // options object
});

// world is a snapshot of all the shapes we have
World.add(world, shape);
