const POD_SIZE = 5;

class Maze {
  constructor(grid_rows, grid_cols, player) {
    this.rows = grid_rows; 
    this.cols = grid_cols; 

    this.cells = [];
    
    this.player = player;
    this.cells_with_player_walls = [];
  }

  handle_place_player_wall(pos, wall) {
    let current_cell = this.get_cell(pos.row, pos.col);
    let other_cell = null;
    let other_wall = null;

    if (wall == 'top') {
      other_cell = this.get_cell(pos.row - 1, pos.col);
      other_wall = 'bot';
    } else if (wall == 'right') {
      other_cell = this.get_cell(pos.row, pos.col + 1);
      other_wall = 'left';
    } else if (wall == 'bot') {
      other_cell = this.get_cell(pos.row + 1, pos.col);
      other_wall = 'top';
    } else if (wall == 'left') {
      other_cell = this.get_cell(pos.row, pos.col - 1);
      other_wall = 'right';
    }
    
    if(!this.has_walls(current_cell, other_cell)) {
      current_cell.toggle_player_wall(wall);
      other_cell.toggle_player_wall(other_wall);
      this.cells_with_player_walls.push(current_cell);
    }
  }

  handle_place_flag(pos) {
    let current_cell = this.get_cell(pos.row, pos.col);
    current_cell.toggle_player_flag();
  }

  update_cell(my_cell, server_cell) {
    my_cell.walls = server_cell.walls;
    /* for now we only have this stuff for update */
  }

  init_cells_from_server_cells(server_cells) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let server_cell = server_cells[row * this.cols + col];
        let new_cell = new Cell(row, col);
        this.update_cell(new_cell, server_cell)
        this.cells.push(new_cell);
      }
    }
  }

  get_cell(row, col) {
    if (col >= 0 && col < this.cols && row >= 0 && row < this.rows)
      return this.cells[row*this.cols + col];
    return null;
  }

  show() {
    // draw player walls
    for (let idx = 0;idx < this.cells_with_player_walls.length;idx++) {
      this.cells_with_player_walls[idx].show_player_walls(this.player.color);
    }

    // draw cells
    for (let idx = 0;idx < this.cells.length;idx++) {
      this.cells[idx].show();
      this.cells[idx].show_player_flag(this.player.color);
    }

    // show player
    this.player.show();
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