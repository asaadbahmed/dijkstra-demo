const GRID_SIZE = 10; // NxN grid

document.addEventListener("DOMContentLoaded", function () {
    console.log(`Creating a ${GRID_SIZE}x${GRID_SIZE} grid of dots.`);
    
    const workspace = document.getElementById("workspace");
    const totalDots = GRID_SIZE * GRID_SIZE;

    for (let i = 0; i < totalDots; i++) {
        workspace.appendChild(document.createElement("div"));
    }

    console.log("Successfully created grid dots.");
});