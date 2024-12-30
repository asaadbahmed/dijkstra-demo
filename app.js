const GRID_SIZE = 10; // NxN grid
const DOT_SIZE = 30; // NxN dot (pixels)
const DOT_GAP = 10; // Gap between dots (pixels)
const DOT_COLOR = "#000000"; // Color of the dots

document.addEventListener("DOMContentLoaded", function () {
    console.log(`Creating a ${GRID_SIZE}x${GRID_SIZE} grid of dots.`);
    
    const workspace = document.getElementById("workspace");
    const totalDots = GRID_SIZE * GRID_SIZE;

    workspace.style.gridTemplateColumns = `repeat(${GRID_SIZE}, ${DOT_SIZE}px)`;
    workspace.style.gridTemplateRows = `repeat(${GRID_SIZE}, ${DOT_SIZE}px)`;
    workspace.style.gap = `${DOT_GAP}px`;

    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div");
        dot.style.backgroundColor = DOT_COLOR;
        workspace.appendChild(dot);
    }

    console.log("Successfully created grid dots.");
});