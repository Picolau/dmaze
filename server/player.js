class Player {
  constructor(id, pos, color) {
    this.id = id;
    this.pos = pos;
    this.color = color;
  }

  update_pos(new_pos) {
    this.pos = new_pos;
  }
}

module.exports = Player;