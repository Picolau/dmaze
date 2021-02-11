const Cell = require('./cell');

const POD_SIZE = 5;

class Maze {
  constructor(grid_rows, grid_cols) {
    this.rows = grid_rows; 
    this.cols = grid_cols; 
    
    let pod_start_row = Math.floor(this.rows/2) - Math.floor(POD_SIZE / 2);
    let pod_start_col = Math.floor(this.cols/2) - Math.floor(POD_SIZE / 2);

    let pod_end_row = Math.floor(this.rows/2) + Math.floor(POD_SIZE / 2);
    let pod_end_col = Math.floor(this.cols/2) + Math.floor(POD_SIZE / 2);

    this.pod_start = {row: pod_start_row, col: pod_start_col};
    this.pod_end = {row: pod_end_row, col: pod_end_col};

    this.cells = [];
    //this.deadend_cells = [];
    
    this.build_complete = false;

    this.init_cells();
    this.init_discoverer_cell();
    this.build_maze();
  }

  get_cell(row, col) {
    if (col >= 0 && col < this.cols && row >= 0 && row < this.rows)
      return this.cells[row*this.cols + col];
    return null;
  }

  build_maze() {
    while (!this.build_complete) {
      this.build_complete = true;
      this.discoverer_cell.visited = true;

      let next_cell = this.select_next_cell();
      
      if (next_cell) {
        this.build_complete = false;

        // break the walls
        this.break_wall(this.discoverer_cell, next_cell);

        // set new discoverer cell
        next_cell.path_size = this.discoverer_cell.path_size + 1;
        next_cell.ancestral = this.discoverer_cell;

        this.discoverer_cell = next_cell;
      } else {
        if (this.discoverer_cell.walls_count() == 3) {
          this.discoverer_cell.is_deadend = true;
          //this.deadend_cells.push(this.discoverer_cell);
        }

        this.discoverer_cell = this.discoverer_cell.ancestral;

        if (this.discoverer_cell)
          this.build_complete = false;
      }
    }

    //console.log(this.deadend_cells.length);
  }

  break_wall(cell1, cell2) {
    let relative_pos = cell1.where_is(cell2);
    if (relative_pos == 'top') {
      cell1.walls.top = false;
      cell2.walls.bot = false;
    } else if (relative_pos == 'bot') {
      cell1.walls.bot = false;
      cell2.walls.top = false;
    } else if (relative_pos == 'left') {
      cell1.walls.left = false;
      cell2.walls.right = false;
    } else if (relative_pos == 'right') {
      cell1.walls.right = false;
      cell2.walls.left = false;
    }
  }

  select_next_cell() {
    let current_cell = this.discoverer_cell;

    let my_top_cell   = this.get_cell(current_cell.row - 1, current_cell.col);
    let my_bot_cell   = this.get_cell(current_cell.row + 1, current_cell.col);
    let my_left_cell  = this.get_cell(current_cell.row, current_cell.col - 1);
    let my_right_cell = this.get_cell(current_cell.row, current_cell.col + 1);

    let list_cells = [];
    if (my_top_cell && !my_top_cell.visited) {
      list_cells.push(my_top_cell);
    }
    if (my_bot_cell && !my_bot_cell.visited) {
      list_cells.push(my_bot_cell);
    }
    if (my_left_cell && !my_left_cell.visited) {
      list_cells.push(my_left_cell);
    }
    if (my_right_cell && !my_right_cell.visited) {
      list_cells.push(my_right_cell);
    }

    return list_cells[Math.floor(Math.random() * list_cells.length)];
  }

  init_cells() {
    /* Init all cells */
    for (let row = 0;row < this.rows;row++) {
      for (let col = 0;col < this.cols;col++) {
        this.cells.push(new Cell(row, col));
      }
    }

    /* Init pod cells */
    for (let row = this.pod_start.row;row <= this.pod_end.row;row++) {
      for (let col = this.pod_start.col;col <= this.pod_end.col;col++) {
        let idx = row * this.cols + col;
        
        this.cells[idx].walls.top = false;
        this.cells[idx].walls.bot = false;
        this.cells[idx].walls.right = false;
        this.cells[idx].walls.left = false;
        this.cells[idx].is_pod_cell = true;
        this.cells[idx].visited = true;
      }
    }
  }

  init_discoverer_cell() {
    this.discoverer_cell = this.cells[0];
  }

  has_walls(pos_from, pos_to) {
    let row_from = pos_from.row;
    let col_from = pos_from.col;

    let row_to = pos_to.row;
    let col_to = pos_to.col;

    if (row_from == row_to && col_from == col_to)
      return false;

    let cell_from = this.get_cell(row_from, col_from);
    let cell_to = this.get_cell(row_to, col_to);

    if (!cell_to)
      return true;

    let pos = cell_from.where_is(cell_to); // result is top/bot/right/left

    return cell_from.walls[pos];
  }
}

module.exports = Maze;