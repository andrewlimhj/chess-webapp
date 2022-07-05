/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import { resolve } from 'path';
import cookie from 'cookie';
import PlayerServices from '../services/player.service.js';
import GameServices from '../services/game.service.js';
import ParticipantServices from '../services/participant.service.js';
import MoveServices from '../services/move.service.js';
import db from '../db/models/index.model.js';

const playerService = new PlayerServices(db);
const gameService = new GameServices(db);
const participantService = new ParticipantServices(db);
const moveService = new MoveServices(db);

let players;

const games = Array(100);
for (let i = 0; i < 100; i += 1) {
  games[i] = { players: 0, pid: [0, 0] };
}

export const getChess = (req, res) => {
  if (req.isUserLoggedIn === false) {
    console.log('Not logged in');
    res.redirect('/login');
    return;
  }

  console.log('IN GET CHESS');

  // res.sendFile(`${__dirname}/index.html`);
  res.sendFile(resolve('dist', 'index.html'));
};

export const socketIo = (io) => {
  // io.use(async (socket, next) => {
  //   console.log('Socket: ', socket.cookie);
  // });

  io.on('connection', (socket) => {
    // check cookie if user is logged in
    const cookies = cookie.parse(socket.handshake.headers.cookie);

    const { LoggedIn, userId } = cookies;
    console.log('userId: ', userId);

    if (!LoggedIn) {
      console.log('Logged In: ', LoggedIn);
      console.log('Not logged in');
      // res.redirect('/login');
      socket.emit('login');
      return;
    }

    // just assign a random number to every player that has connected
    // the numbers have no significance so it
    // doesn't matter if 2 people get the same number

    // const playerId = Math.floor(Math.random() * 100 + 1);
    const playerId = userId;
    console.log(`${playerId} connected`);

    let color; // black or white
    let userName;
    let photoLink;
    let playerRating;
    let gameId;
    let participantId;
    let moveOrder = 0;

    // 'joined' is emitted when the player enters a room number and clicks
    // the connect button the room ID that the player entered gets passed as a message

    socket.on('joined', async (roomId) => {
      console.log('player ID: ', playerId);

      try {
        const getProfile = await playerService.getProfile(playerId);

        // eslint-disable-next-line camelcase
        const { user_name, photo, rating } = getProfile;

        // eslint-disable-next-line camelcase
        userName = user_name;
        photoLink = photo;
        playerRating = rating;

        console.log('Profile: ', userName, photo, rating);
      } catch (error) {
        console.log('Error executing query', error.stack);
      }

      console.log('ROOM ID', roomId);

      // if the room is not full then add the player to that room
      if (games[roomId].players < 2) {
        // eslint-disable-next-line no-plusplus
        games[roomId].players++;
        games[roomId].pid[games[roomId].players - 1] = playerId;
      } else {
        socket.emit('full', roomId);
        return;
      }
      players = games[roomId].players;
      // the first player to join the room gets white
      if (players % 2 === 0) color = 'black';
      else color = 'white';

      // Add player who started the game into the games table
      if (players === 1) {
        try {
          const postGame = await gameService.postGame(playerId, roomId);

          gameId = postGame.id;
        } catch (error) {
          console.log('Error executing query', error.stack);
        }
      } else {
        // get game id
        try {
          const getGameId = await gameService.getGameId(roomId);

          gameId = await getGameId[0].id;

          console.log('Game ID: ', getGameId[0].id);
        } catch (error) {
          console.log('Error executing query', error);
        }
      }

      // post participant
      try {
        const postParticipant = await participantService.postParticipant(
          playerId,
          gameId
        );

        console.log('Participant: ', postParticipant);
      } catch (error) {
        console.log('Error executing query', error.stack);
      }

      // this is an important event because, once this is emitted the game
      // will be set up in the client side, and it'll display the chess board
      socket.emit('player', {
        userName,
        playerId,
        players,
        color,
        photoLink,
        playerRating,
        roomId,
      });
    });

    // The client side emits a 'move' event when a valid move has been made.
    socket.on('move', async (msg) => {
      let moves;
      // get participant id to post move
      try {
        const getParticipantId = await participantService.getParticipantId(
          playerId,
          gameId
        );

        participantId = getParticipantId.id;
        console.log('Participant ID: ', participantId);

        // add plus 1 for each player move
        moveOrder += 1;
        console.log('move order: ', moveOrder);

        // post move
        const postMove = await moveService.postMove(
          gameId,
          moveOrder,
          participantId,
          msg
        );

        moves = postMove;
      } catch (error) {
        console.log('Error executing query', error);
      }

      // console.log(moves);
      console.log(msg);
      // const { rooms } = io.of('/').adapter;
      // console.log('rooms: ', rooms);
      // const { sids } = io.of('/').adapter;
      // console.log('sids: ', sids);

      // pass on the move event to the other clients
      io.local.emit('move', { msg, moves });
      // socket.broadcast.emit('move', { msg, moves });
    });

    // 'play' is emitted when both players have joined and the game can start
    socket.on('play', (msg) => {
      socket.broadcast.emit('play', msg);
      console.log(`ready ${msg}`);
    });

    // when the user disconnects from the server, remove him from the game room
    socket.on('disconnect', () => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 100; i++) {
        // eslint-disable-next-line no-plusplus
        if (games[i].pid[0] === playerId || games[i].pid[1] === playerId) {
          // eslint-disable-next-line no-plusplus
          games[i].players--;
        }
      }
      console.log(`${playerId} disconnected`);
    });
  });
};
