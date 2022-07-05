class PlayerServices {
  constructor(db) {
    this.db = db;
  }

  // get username
  // get photo
  // get rating
  getProfile = async (user) => {
    try {
      const userId = user;
      console.log('user ID', userId);

      const profile = await this.db.Player.findOne({
        where: {
          id: userId,
        },
      });

      return profile;
    } catch (error) {
      console.log('Error executing query', error.stack);
    }
  };
}

export default PlayerServices;
