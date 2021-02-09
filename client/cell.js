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
    this.is_pod_cell = false;

    this.player_walls = {top: false, bot: false, left: false, right: false};
  }

  toggle_player_wall(wall) {
    this.player_walls[wall] = !this.player_walls[wall];
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

  show() {
    let x = this.col * MAZE_SQUARE_SIZE;
    let y = this.row * MAZE_SQUARE_SIZE;
    
    stroke(255);
    if (this.walls.top) {
      line(x, y, x + MAZE_SQUARE_SIZE, y);
    }
    if (this.walls.right) {
      line(x + MAZE_SQUARE_SIZE, y, x + MAZE_SQUARE_SIZE, y + MAZE_SQUARE_SIZE);
    }
    if (this.walls.bot) {
      line(x + MAZE_SQUARE_SIZE, y + MAZE_SQUARE_SIZE, x, y + MAZE_SQUARE_SIZE);
    }
    if (this.walls.left) {
      line(x, y + MAZE_SQUARE_SIZE, x, y);
    }
  }

  show_player_walls(color) {
    let x = this.col * MAZE_SQUARE_SIZE;
    let y = this.row * MAZE_SQUARE_SIZE;
    
    stroke(color.r,color.g,color.b);
    if (this.player_walls.top) {
      line(x, y, x + MAZE_SQUARE_SIZE, y);
    }
    if (this.player_walls.right) {
      line(x + MAZE_SQUARE_SIZE, y, x + MAZE_SQUARE_SIZE, y + MAZE_SQUARE_SIZE);
    }
    if (this.player_walls.bot) {
      line(x + MAZE_SQUARE_SIZE, y + MAZE_SQUARE_SIZE, x, y + MAZE_SQUARE_SIZE);
    }
    if (this.player_walls.left) {
      line(x, y + MAZE_SQUARE_SIZE, x, y);
    }
  }
}
