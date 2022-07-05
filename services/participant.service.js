class ParticipantServices {
  constructor(db) {
    this.db = db;
  }

  postParticipant = async (player, game) => {
    try {
      const playerId = player;
      const gameId = game;

      const participant = await this.db.Participant.create({
        player_id: playerId,
        game_id: gameId,
      });

      return participant;
    } catch (error) {
      console.log('Error executing query', error);
    }
  };

  getParticipantId = async (playerId, gameId) => {
    try {
      const participantId = await this.db.Participant.findOne({
        where: {
          player_id: playerId,
          game_id: gameId,
        },
      });

      return participantId;
    } catch (error) {
      console.log('Error executing query', error);
    }
  };
}

export default ParticipantServices;
