const { Engine, Render, Runner, World, Bodies } = Matter;

// the math is easier for a maze with the canvas is a square
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

// Walls
const walls = [
  // making use of the variables for the placements instead of fixed figures
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
];
World.add(world, walls);
