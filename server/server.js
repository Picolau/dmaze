const Maze = require('./maze');
const Player = require('./player');

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');

const publicPath = path.join(__dirname, '/../client');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);

let io = socketIO(server, {
    cors: {
        origin: "http://localhost.com"
    }
});

app.use(express.static(publicPath));

server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});

io.on('connection', (socket) => {
    console.log('A user just connected.');
    
    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
        /* TODO: PLAYER LOST CONNECTION */
    })

    socket.on('client_move_player', (pos_to_move) => {
        let player_that_wants_to_move = all_players[socket.id];
        let can_move = !maze.has_walls(player_that_wants_to_move.pos, pos_to_move);

        if (can_move) {
            player_that_wants_to_move.update_pos(pos_to_move);
            io.emit('client_move_player', player_that_wants_to_move);
        }
    })
    
    if (!all_players[socket.id]) {
        let new_player = create_new_player(socket.id);
        add_player_to_all_players(new_player);
    } else {
        /* TODO: PLAYER RECONNECTED */
    }

    io.emit('client_initialize', {
        maze: maze,
        players: all_players
    });
});

let rows = 100;
let cols = 100;
let mid_row = Math.floor(rows / 2);
let mid_col = Math.floor(cols / 2);

let maze = new Maze(rows, cols);
let all_players = {};

let spawn_pos_order = [
    {row: mid_row - 1, col: mid_col - 1},
    {row: mid_row - 1, col: mid_col + 1},
    {row: mid_row + 1, col: mid_col - 1},
    {row: mid_row + 1, col: mid_col + 1},
]

let spawn_color_order = [
    {r: 100, g: 255, b: 255}, // blue
    {r: 100, g: 255, b: 100}, // green
    {r: 255, g: 100, b: 100}, // red
    {r: 255, g: 255, b: 100}, // yellow
]

create_new_player = (id) => {
    let spawn_idx = Object.keys(all_players).length;
    let pos_player = spawn_pos_order[spawn_idx];
    let color_player = spawn_color_order[spawn_idx];

    let new_player = new Player(id, pos_player, color_player);

    return new_player;
}

add_player_to_all_players = (player_to_add) => {
    all_players[player_to_add.id] = player_to_add;
}