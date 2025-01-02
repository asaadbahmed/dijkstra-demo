// CONFIGURATION --------------------------------------------------------
const GRID_COLOR = "#f0f0f0"; // Color of the grid
const GRID_SIZE = 10; // NxN grid (how many columns, how many rows)
const DOT_SIZE = 5; // NxN dot (pixels)
const DOT_COLOR = "#000000"; // Color of each dot
const NODE_MIN_DISTANCE = 5; // Minimum distance between nodes (pixels)
const NODE_COLOR = "#0000FF"; // Color of each node
const NODE_SIZE = DOT_SIZE * 2; // NxN node (pixels)
const MAX_NODES = 10; // Maximum number of placeable nodes
const NODES = []; // Array of nodes
// END ------------------------------------------------------------------

let state = "idle"; // idle, placing-node, placing-edge
let onMouseMovePlacingNode = null;
let onMouseClickPlacingNode = null;

/*
// TODO: Cool animation for drawing the best path calculated by the algorithm
// TODO: Make it so if a node is x distance away from another node, it isn't allowed to be placed
IGNORE THIS
Unrelated to the project just a random idea I had for something else
Maintain a list of unoccupied nodes
Choose a random node, pop that node from the list
*/

// click two nodes to place an edge between them

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
function placeNode(clickData) {
  const workspace = document.getElementById("workspace");
  const placeNodeButton = document.getElementById("place-node");

  if (NODES.length >= MAX_NODES) return;
  if (state === "placing-node") {
    state = "idle";
    placeNodeButton.innerText = "Place Node";
    placeNodeButton.style.backgroundColor = "rgb(10, 91, 208)";
    placeNodeButton.style.borderColor = "rgb(10, 91, 208)";
    workspace.style.cursor = "default";

    const node = NODES.pop();
    if (node && node.htmlElement) workspace.removeChild(node.htmlElement);
    document.removeEventListener("mousemove", onMouseMovePlacingNode);
    document.removeEventListener("click", onMouseClickPlacingNode);
    return;
  }

  const workspaceDimensions = workspace.getBoundingClientRect();
  const node = document.createElement("div");
  const centerX =
    workspaceDimensions.left + workspaceDimensions.width / 2 - NODE_SIZE / 2;
  const centerY =
    workspaceDimensions.top + workspaceDimensions.height / 2 - NODE_SIZE / 2;
  NODES.push({
    x: centerX,
    y: centerY,
    htmlElement: node,
  });

  state = "placing-node";

  placeNodeButton.innerText = "Cancel";
  placeNodeButton.style.backgroundColor = "red";
  placeNodeButton.style.borderColor = "red";

  node.id = `node-${NODES.length}`;
  node.style.width = `${NODE_SIZE}px`;
  node.style.height = `${NODE_SIZE}px`;
  node.style.backgroundColor = NODE_COLOR;
  node.style.borderRadius = "50%";
  node.style.position = "absolute";
  node.style.left = `${centerX}px`;
  node.style.top = `${centerY}px`;

  workspace.style.cursor = "none";
  workspace.appendChild(node);

  onMouseMovePlacingNode = (data) => {
    if (state !== "placing-node") return;
    const x = clamp(
      data.clientX - NODE_SIZE / 2,
      workspaceDimensions.left,
      workspaceDimensions.right - NODE_SIZE
    );
    const y = clamp(
      data.clientY - NODE_SIZE / 2,
      workspaceDimensions.top,
      workspaceDimensions.bottom - NODE_SIZE
    );
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
  };

  onMouseClickPlacingNode = (data) => {
    if (state !== "placing-node") return;
    const x = clamp(
      data.clientX - NODE_SIZE / 2,
      workspaceDimensions.left,
      workspaceDimensions.right - NODE_SIZE
    );
    const y = clamp(
      data.clientY - NODE_SIZE / 2,
      workspaceDimensions.top,
      workspaceDimensions.bottom - NODE_SIZE
    );

    // return if the click is outside grid bounds
    if (
      data.clientX < workspaceDimensions.left ||
      data.clientX > workspaceDimensions.right ||
      data.clientY < workspaceDimensions.top ||
      data.clientY > workspaceDimensions.bottom
    ) {
      return;
    }

    state = "idle";
    document.removeEventListener("mousemove", onMouseMovePlacingNode);
    document.removeEventListener("click", onMouseClickPlacingNode);

    // TODO: Make sure to only compare NODES[0 -> NODES.length - 2], so we ignore the most recent node, when doing the distance checks

    // we want to re-add the node to the array, but with the final x and y values
    const placedNode = NODES.pop();
    placedNode.x = x;
    placedNode.y = y;
    NODES.push(placedNode);

    workspace.style.cursor = "default";
    placeNodeButton.innerText = "Place Node";
    placeNodeButton.style.backgroundColor = "rgb(10, 91, 208)";
    placeNodeButton.style.borderColor = "rgb(10, 91, 208)";

    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    const nodeCounter = document.getElementById("node-counter");
    if (nodeCounter.style.visibility === "hidden")
      nodeCounter.style.visibility = "visible";
    nodeCounter.innerText = `Nodes Placed: ${NODES.length} / ${MAX_NODES}`;
  };

  document.addEventListener("mousemove", onMouseMovePlacingNode);
  document.addEventListener("click", onMouseClickPlacingNode);
}

document.addEventListener("DOMContentLoaded", function () {
  const numberOfDots = GRID_SIZE * GRID_SIZE;
  const workspaceContainer = document.getElementById("workspace");
  const placeNodeButton = document.getElementById("place-node");

  try {
    if (!workspaceContainer)
      throw new Error('Element with id "workspace" does not exist..');
    if (!placeNodeButton)
      throw new Error('Element with id "place-node" does not exist.');
  } catch (error) {
    console.error(
      `${error} Please make sure all of these elements exist in /index.html. If they do, and the problem persists, it could be a loading issue.`
    );
    return;
  }

  placeNodeButton.addEventListener("click", placeNode);

  workspaceContainer.style.backgroundColor = GRID_COLOR;
  workspaceContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
  workspaceContainer.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;

  for (let i = 0; i < numberOfDots; i++) {
    const dot = document.createElement("div");
    dot.style.width = `${DOT_SIZE}px`;
    dot.style.height = `${DOT_SIZE}px`;
    dot.style.backgroundColor = DOT_COLOR;
    dot.style.borderRadius = "50%";
    workspaceContainer.appendChild(dot);
  }
});
