// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Videos
// https://youtu.be/HyK_Q5rrcr4
// https://youtu.be/D8UgRyRnvXU
// https://youtu.be/8Ju_uxJ9v44
// https://youtu.be/_p5IH0L63wo

// Depth-first search
// Recursive backtracker
// https://en.wikipedia.org/wiki/Maze_generation_algorithm

class Cell {

  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.walls = {top: true, bot: true, left: true, right: true};
    this.visited = false;
    this.is_pod_cell = false;
  }
  
  where_is(other_cell) {
    let row_diff = this.row - other_cell.row;
    let col_diff = this.col - other_cell.col;

    if (row_diff > 0)
      return 'top';
    if (row_diff < 0)
      return 'bot';
    if (col_diff > 0)
      return 'left';
    if (col_diff < 0)
      return 'right';
  }
}

module.exports = Cell;
