class MoveServices {
  constructor(db) {
    this.db = db;
  }

  postMove = async (gameId, moveOrder, participantId, moves) => {
    try {
      const move_order = moveOrder;

      const move = await this.db.Move.create({
        game_id: gameId,
        participant_id: participantId,
        move_order: move_order,
        fen: moves.board,
        from_position: moves.move.from,
        to_position: moves.move.to,
        color: moves.move.color,
        san: moves.move.san,
        captured: moves.move.captured,
      });

      return move;
    } catch (error) {
      console.log('Error executing query', error);
    }
  };
}

export default MoveServices;
