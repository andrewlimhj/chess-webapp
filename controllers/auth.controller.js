/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { resolve } from 'path';
// import { fileURLToPath } from 'url';
import { getHashedString, getHashWithSalt } from '../hash.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

class AuthController {
  constructor(db) {
    this.db = db;
  }

  /* --------------------------------- sign-up -------------------------------- */

  getSignUp = async (req, res) => {
    const { LoggedIn } = req.cookies;

    if (req.isUserLoggedIn === true) {
      console.log('Already logged in');
      res.redirect('/');
      return;
    }

    // res.render('sign-up', { LoggedIn });
    res.sendFile(resolve('dist', 'sign-up.html'), { LoggedIn });
  };

  postSignUp = async (req, res, next) => {
    if (req.isUserLoggedIn === true) {
      console.log('Already logged in');
      res.redirect('/');
      return;
    }

    try {
      const hashedPassword = getHashedString(req.body.password);

      const { email, user_name, photo } = req.body;

      console.log('Post');
      const signUp = await this.db.Player.create({
        email,
        password: hashedPassword,
        user_name,
        photo,
      });

      console.log('SIGN UP', signUp);

      res.redirect('/login');
    } catch (error) {
      console.log('Error executing query', error.stack);
      next(error);
    }
  };

  /* ---------------------------------- login --------------------------------- */

  getLogin = (req, res) => {
    const { LoggedIn } = req.cookies;

    if (req.isUserLoggedIn === true) {
      console.log('Already logged in');
      res.redirect('/');
      return;
    }

    // res.sendFile(path.join(`${__dirname}/../src/login.html`), { LoggedIn });

    res.sendFile(resolve('dist', 'login.html'), { LoggedIn });
  };

  postLogin = async (req, res, next) => {
    if (req.isUserLoggedIn === true) {
      console.log('Already logged in');
      res.redirect('/');
      return;
    }

    try {
      const { email } = req.body;

      const player = await this.db.Player.findOne({
        where: {
          email,
        },
      });

      console.log('Login Object', player);

      const hashedPasswordInDatabase = player.password;
      const hashedPasswordFromLogin = getHashedString(req.body.password);

      if (hashedPasswordInDatabase === hashedPasswordFromLogin) {
        const hashedCookieString = getHashWithSalt(player.id);

        res.cookie('LoggedIn', true);
        res.cookie('LoggedInHash', hashedCookieString);

        res.cookie('userId', player.id);

        res.redirect('/');
      } else {
        console.log('Email and password combination incorrect!');
        res.redirect('/login');
      }
    } catch (error) {
      console.log('Error executing query', error.stack);
      next(error);
    }
  };

  /* --------------------------------- logout --------------------------------- */

  logout = (req, res) => {
    console.log('loggin out');
    res.clearCookie('userId');
    res.clearCookie('LoggedInHash');
    res.clearCookie('LoggedIn');
    res.redirect('/login');
  };
}

export default AuthController;
