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

  constructor(id, row, col) {
    this.id = id;
    this.row = row;
    this.col = col;
    this.walls = {top: true, bot: true, left: true, right: true};
    this.visited = false;
    this.is_pod_cell = false;
    this.ancestral_id = null;
    this.path_size = 0;
    this.is_deadend = false;
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

  walls_count() {
    return this.walls.top + this.walls.bot + this.walls.left + this.walls.right;
  }
}

module.exports = Cell;
