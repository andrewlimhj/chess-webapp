class GameServices {
  constructor(db) {
    this.db = db;
  }

  postGame = async (user, room) => {
    try {
      const playerId = user;
      const roomId = room;

      const game = await this.db.Game.create({
        player_start_id: playerId,
        room_id: roomId,
      });

      return game;
    } catch (error) {
      console.log('Error executing query', error);
    }
  };

  getGameId = async (roomId) => {
    try {
      const gameId = await this.db.Game.findAll({
        limit: 1,
        where: {
          room_id: roomId,
        },
        order: [['createdAt', 'DESC']],
      });

      return gameId;
    } catch (error) {
      console.log('Error executing query', error);
    }
  };
}

export default GameServices;
