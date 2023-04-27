const handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    db.select('*')
      .from('users')
      .where({ id })
      .then((user) => {
        // use the if statement because if an empty array is found it returns as true
        if (user.length) {
          res.json(user[0].user);
        } else {
          res.status(400).json('Not Found');
        }
      })
      .catch((err) => res.status(400).json('Error getting user'));
  };

  module.exports = {
    handleProfileGet
  }