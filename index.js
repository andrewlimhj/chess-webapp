/* -------------------------------------------------------------------------- */
/*                                  chess app                                 */
/* -------------------------------------------------------------------------- */

import express from 'express';
import socketio from 'socket.io';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import path from 'path';
// import { fileURLToPath } from 'url';
import AuthRouter from './routes/auth.routes.js';
import ChessRouter from './routes/chess.routes.js';
import { socketIo } from './controllers/chess.controller.js';

// const __filename = fileURLToPath(import.meta.url);

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname('../');

// Initialise Express instance
const app = express();
// Set the Express view engine to expect EJS templates
app.set('view engine', 'ejs');
// Bind cookie parser middleware to parse cookies in requests
app.use(cookieParser());
// Bind Express middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: false }));
// Bind Express middleware to parse JSON request bodies
app.use(express.json());
// Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(methodOverride('_method'));
// Expose the files stored in the public folder
app.use(express.static('public'));
// Expose the files stored in the distribution folder
app.use(express.static('dist'));
// Add the static directory for our js and css files
app.use(express.static(`${__dirname}/`));

// Set Express to listen on the given port
const PORT = process.env.PORT || 3004;

/* --------------------------------- routes --------------------------------- */

const routers = [AuthRouter, ChessRouter];

routers.forEach((router) => {
  app.use('/', router);
});

const server = app.listen(PORT, () => {
  console.log(`application running at ${PORT}`);
});

// Play Chess
const io = socketio(server);
socketIo(io);
