// CONFIGURATION --------------------------------------------------------
const GRID_COLOR = "#f0f0f0"; // Color of the grid
const GRID_SIZE = 10; // NxN grid (how many columns, how many rows)
const DOT_SIZE = 5; // NxN dot (pixels)
const DOT_COLOR = "#000000"; // Color of each dot
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
// TODO: Make the cursor a pointer/appear when you leave the grid and hide the node
// TODO: Track & Check if there's already a node there
// TODO: Add a visual counter that shows how many of the max number of nodes u have placed so far
IGNORE THIS
Unrelated to the project just a random idea I had for something else
Maintain a list of unoccupied nodes
Choose a random node, pop that node from the list
*/

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
function placeNode() {
    const workspace = document.getElementById("workspace");
    const placeNodeButton = document.getElementById("place-node"); 
    
    if (NODES.length >= MAX_NODES) return;
    if (state === "placing-node") {
        state = "idle";
        placeNodeButton.innerText = "Place Node";
        workspace.style.cursor = "default";
        
        const node = NODES.pop();
        if (node && node.htmlElement) workspace.removeChild(node.htmlElement);
        document.removeEventListener("mousemove", onMouseMovePlacingNode);
        document.removeEventListener("click", onMouseClickPlacingNode);
        return;
    }

    const workspaceDimensions = workspace.getBoundingClientRect();
    const node = document.createElement("div");
    const centerX = workspaceDimensions.left + workspaceDimensions.width / 2 - NODE_SIZE / 2;
    const centerY = workspaceDimensions.top + workspaceDimensions.height / 2 - NODE_SIZE / 2;
    NODES.push({
        "x": centerX,
        "y": centerY,
        "htmlElement": node
    });
    
    state = "placing-node";
    placeNodeButton.innerText = "Cancel";
    
    node.style.width = `${NODE_SIZE}px`;
    node.style.height = `${NODE_SIZE}px`;
    node.style.backgroundColor = NODE_COLOR;
    node.style.borderRadius = "50%";
    node.style.position = "absolute";
    // this bit places the node in the center of the grid initially
    node.style.left = `${centerX}px`;
    node.style.top = `${centerY}px`;

    workspace.style.cursor = "none";
    workspace.appendChild(node);

    onMouseMovePlacingNode = data => {
        const x = clamp(data.clientX - NODE_SIZE / 2, workspaceDimensions.left, workspaceDimensions.right - NODE_SIZE);
        const y = clamp(data.clientY - NODE_SIZE / 2, workspaceDimensions.top, workspaceDimensions.bottom - NODE_SIZE);
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
    }

    onMouseClickPlacingNode = data => {
        const x = clamp(data.clientX - NODE_SIZE / 2, workspaceDimensions.left, workspaceDimensions.right - NODE_SIZE);
        const y = clamp(data.clientY - NODE_SIZE / 2, workspaceDimensions.top, workspaceDimensions.bottom - NODE_SIZE);

        // return if the click is outside grid bounds
        if (
            data.clientX < workspaceDimensions.left ||
            data.clientX > workspaceDimensions.right ||
            data.clientY < workspaceDimensions.top ||
            data.clientY > workspaceDimensions.bottom
        ) {
            console.log("click is outside grid bounds");
            return;
        };
        
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

        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
    }

    document.addEventListener("mousemove", onMouseMovePlacingNode);
    document.addEventListener("click", onMouseClickPlacingNode);
}

document.addEventListener("DOMContentLoaded", function () {
    const numberOfDots = GRID_SIZE * GRID_SIZE;
    const workspaceContainer = document.getElementById("workspace");
    const placeNodeButton = document.getElementById("place-node");
    
    try {
        if (!workspaceContainer) throw new Error("Element with id \"workspace\" does not exist..");
        if (!placeNodeButton) throw new Error("Element with id \"place-node\" does not exist.");
    } catch(error) {
        console.error(`${error} Please make sure all of these elements exist in /index.html. If they do, and the problem persists, it could be a loading issue.`);
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