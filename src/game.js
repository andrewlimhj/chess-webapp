/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
/* eslint-disable no-undef */

import 'core-js';
import './signin.css';

console.log('in game.js');

let board;

const game = new Chess();

const socket = io();

let color = 'white';
let players;
let roomId;
let play = true;
let counter = 0;
let moveNum = 1;
let userName;
let photo;
let rating;

// For some DOM manipulation later
const room = document.getElementById('room');
const roomNumber = document.getElementById('roomNumbers');
const button = document.getElementById('button');
const state = document.getElementById('state');
const player = document.getElementById('player');
const movesTable = document.getElementById('moves');
const avatar = '<i class="fas fa-solid fa-user"></i>';
const door = '<i class="fas fa-solid fa-door-closed"></i>';
const pending = '<i class="fas fa-solid fa-hourglass"></i>';
const progress = '<i class="fas fa-solid fa-spinner"></i>';

const removeGreySquares = () => {
  $('#board .square-55d63').css('background', '');
};

const greySquare = (square) => {
  const squareEl = $(`#board .square-${square}`);
  let background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

const onDragStart = (source, piece) => {
  // do not pick up pieces if the game is over
  // or if it's not that side's turn
  if (
    game.game_over() === true ||
    play ||
    (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
    (game.turn() === 'w' && color === 'black') ||
    (game.turn() === 'b' && color === 'white')
  ) {
    return false;
  }
};

const onDrop = (source, target) => {
  removeGreySquares();

  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q',
    // NOTE: always promote to a queen for example simplicity
  });

  if (game.game_over()) {
    state.innerHTML = 'GAME OVER';
    socket.emit('gameOver', roomId);
  }

  // illegal move
  if (move === null) {
    return 'snapback';
  }

  // if the move is allowed, emit the move event.
  socket.emit('move', {
    move,
    board: game.fen(),
    room: roomId,
  });
};

const onMouseoverSquare = (square, piece) => {
  // get list of possible moves for this square
  const moves = game.moves({
    square,
    verbose: true,
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (let i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

const onMouseoutSquare = (square, piece) => {
  removeGreySquares();
};

const onSnapEnd = () => {
  board.position(game.fen());
  console.log('FEN', game.fen());
  console.log('move', game);
};

socket.on('player', (msg) => {
  console.log('MSG', msg);

  // show the players number and color in the player div
  color = msg.color;
  players = msg.players;
  userName = msg.userName;
  photo = msg.photoLink;
  rating = msg.playerRating;

  player.innerHTML = `${avatar} ${userName}`;

  // emit the play event when 2 players have joined
  if (players === 2) {
    play = false;
    // relay it to the other player that is in the room
    socket.emit('play', msg.roomId);
    // change the state from 'join room' to -
    state.innerHTML = `${progress} Game in Progress`;
  }
  // if only one person is in the room
  else state.innerHTML = `${pending} Waiting for Second player`;

  const cfg = {
    orientation: color,
    draggable: true,
    position: 'start',
    onDragStart,
    onDrop,
    onMouseoutSquare,
    onMouseoverSquare,
    onSnapEnd,
  };

  board = ChessBoard('board', cfg);
});

// if the room is full (players > 2), redirect the user
// to the full.html page we made earlier
socket.on('full', (msg) => {
  if (roomId === msg) {
    window.location.assign(`${window.location.href}full.html`);
  }
});

// change play to false when both players have
// joined the room, so that they can start playing
// (when play is false the players can play)
socket.on('play', (msg) => {
  console.log('PLAY');
  if (msg === roomId) {
    play = false;
    state.innerHTML = `${progress} Game in progress`;
  }
});

// when a move happens, check if it was meant for the clients room
// if yes, then make the move on the clients board
socket.on('move', (msg) => {
  console.log('Room', msg.msg);
  console.log('moves: ', msg.moves);
  console.log('msg: ', msg);
  console.log('room id: ', roomId);

  if (msg.msg.room === roomId) {
    game.move(msg.msg.move);
    board.position(game.fen());
    console.log('moved');

    // const newMove = document.createElement('tr');
    // const moveMessage = document.createElement('td');
    // moveMessage.insertAdjacentHTML('beforeend', `${msg.moves.san}`);

    if (msg.moves.color === 'w') {
      const newMoveRow = movesTable.insertRow(0);
      const moveNumCell = newMoveRow.insertCell(0);
      const whiteCell = newMoveRow.insertCell(1);

      moveNumCell.style.padding = '5px';
      moveNumCell.insertAdjacentHTML('beforeend', `${moveNum}.`);

      whiteCell.style.padding = '15px';
      whiteCell.insertAdjacentHTML('beforeend', `${msg.moves.san}`);
    } else {
      counter += 1;
      moveNum += 1;
      console.log('counter: ', counter);

      const previousRow = movesTable.rows[movesTable.rows.length - counter];
      const blackCell = previousRow.insertCell(2);

      blackCell.style.padding = '15px';
      blackCell.insertAdjacentHTML('beforeend', `${msg.moves.san}`);
    }
  }
});

socket.on('login', () => {
  console.log('Need to login');
  window.location.assign(`${window.location.href}login.html`);
});

// eslint-disable-next-line no-unused-vars
function connect(req, res) {
  // extract the value of the input field
  roomId = room.value;

  // if the room number is valid
  // eslint-disable-next-line radix
  if (roomId !== '' && parseInt(roomId) <= 100) {
    room.remove();
    roomNumber.innerHTML = `${door} ${roomId}`;
    button.remove();

    // emit the 'joined' event which we have set up a listener for on the server
    console.log('connect');
    socket.emit('joined', roomId);
  }
}

window.connect = connect;
