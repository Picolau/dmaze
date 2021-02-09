class Player {
  constructor(id, pos, color) {
    this.id = id;
    this.pos = pos;
    this.color = color;

    let x = (this.pos.col * MAZE_SQUARE_SIZE) + (MAZE_SQUARE_SIZE / 2);
    let y = (this.pos.row * MAZE_SQUARE_SIZE) + (MAZE_SQUARE_SIZE / 2);

    this.draw_pos = createVector(x,y);
  }

  update_pos(new_pos) {
    this.pos = new_pos;
  }

  update_draw_pos() {
    let x = (this.pos.col * MAZE_SQUARE_SIZE) + (MAZE_SQUARE_SIZE / 2);
    let y = (this.pos.row * MAZE_SQUARE_SIZE) + (MAZE_SQUARE_SIZE / 2);
    let new_draw_pos = createVector(x, y);

    this.draw_pos.lerp(new_draw_pos, 0.3);
  }

  show() {
    this.update_draw_pos();

    stroke(this.color.r,this.color.g,this.color.b,255);
    strokeWeight(0.3);
    /* body */
    fill(this.color.r,this.color.g,this.color.b,200);
    ellipse(this.draw_pos.x, this.draw_pos.y, 4, 4);

    /* return stroke weight to draw maze */
    strokeWeight(1);
  }
}