function findReach(grid, col, row) {
   if (grid[row][col] === '1') return 0;

   let count = 0;
   for (let r = row - 1; r >= 0; r--) {
      if (grid[r][col] === '1') break;
      count++;
   }
   for (let r = row + 1; r < grid.length; r++) {
      if (grid[r][col] === '1') break;
      count++;
   }
   for (let c = col + 1; c < grid[row].length; c++) {
      if (grid[row][c] === '1') break;
      count++;
   }
   for (let c = col - 1; c >= 0; c--) {
      if (grid[row][c] === '1') break;
      count++;
   }

   return count;
}

function solveBoard(board) {
   // Convert board to a 2 dimensional grid
   let rows = board.split(" ");
   let grid = [];
   let solution = [];
   let maxReach = 0;
   rows.forEach(function(row) {
      grid.push(row.split(""));
   });
   console.log(grid);
   for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
         let reach = findReach(grid, c, r);
         if (reach > maxReach) {
            maxReach = reach;
            solution = [];
         }
         if (reach === maxReach) {
            solution.push("(" + r + "," + c + ")");
         }
      }
   }
   if (solution.length > 1) {
      console.log("Cells", solution, "have reach of", maxReach);
   }
   else {
      console.log("Cell", solution, "has reach of", maxReach);
   }
}

solveBoard("0100 0010 1000 0010");