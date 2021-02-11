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

const MAZE_SQUARE_SIZE = 10;
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_E = 69;

let maze;
let my_id, my_player;
let translateX, translateY;
let initialized = false;
let all_players = {};
let my_socket;
let translateVector;

function setup() {
  createCanvas(windowWidth, windowHeight);

  my_socket = io();

  my_socket.on('client_initialize', (server_data) => {
    let server_maze = server_data.maze;
    let server_players = server_data.players; // server_players is a dictionary
    
    if (!initialized) {
      my_id = my_socket.id;

      init_my_player(server_players[my_id]);

      maze = new Maze(server_maze.rows, server_maze.cols, my_player);
      maze.init_cells_from_server_cells(server_maze.cells);

      translateVector = createVector(my_player.draw_pos.x,my_player.draw_pos.y);

      initialized = true;
    }

    update_all_players(server_players);
  });

  my_socket.on('client_move_player', (player_that_moved) => {
    if (player_that_moved.id == my_id) {
      // my_player.update_pos(player_that_moved.pos)
      // already done on client side...
    } else {
      let id = player_that_moved.id;
      let client_player_to_move = all_players[id];
      client_player_to_move.update_pos(player_that_moved.pos);
    }
  });
}

function draw() {
  background(51);
  
  if (initialized) {
    update_screen();
    
    maze.show();

    for (id in all_players) {
      if (id != my_id)
        all_players[id].show();
    }

    my_player.show();
  } else {
    // show loading or waiting for server or something;
  }
}

function update_screen() {
  translateVector.lerp(my_player.draw_pos, 0.05);

  translate(width / 2, height / 2);
  scale(12);
  translate(-translateVector.x, -translateVector.y);
}

function update_all_players(server_players) {
  for (id in server_players) { // sockeid is the key to the dictionary
    if (!all_players[id] && id != my_id) {
      let server_player = server_players[id];
      let new_player = new Player(id, server_player.pos, server_player.color);
      all_players[id] = new_player;
    }
  }
}

function init_my_player(server_player) {
  my_player = new Player(server_player.id, server_player.pos, server_player.color);
  all_players[my_id] = my_player;
}

function keyPressed() {
  let pos = {
    row: my_player.pos.row,
    col: my_player.pos.col
  }
  let pos_to_move = pos;

  if (keyCode === LEFT_ARROW) {
    pos.col -= 1;
  } else if (keyCode === RIGHT_ARROW) {
    pos.col += 1;
  } else if (keyCode === UP_ARROW) {
    pos.row -= 1;
  } else if (keyCode === DOWN_ARROW) {
    pos.row += 1;
  }

  if (keyCode === KEY_W){
    maze.handle_place_player_wall(pos, 'top');
  } else if (keyCode === KEY_A){
    maze.handle_place_player_wall(pos, 'left');
  } else if (keyCode === KEY_S){
    maze.handle_place_player_wall(pos, 'bot');
  } else if (keyCode === KEY_D){
    maze.handle_place_player_wall(pos, 'right');
  }

  if (keyCode === KEY_E) {
    maze.handle_place_flag(pos);
  }

  handle_player_move(pos_to_move);
  my_socket.emit('client_move_player', pos_to_move);
}

function handle_player_move(pos_to_move) {
  let can_move = !maze.has_walls(my_player.pos, pos_to_move);

  if (can_move) {
    my_player.update_pos(pos_to_move);
    my_socket.emit('client_move_player', pos_to_move);
  }
}
