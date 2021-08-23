const LocalStartegy = require("passport-local").Strategy;
const user = require("./model/user.model");

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    const fetchedUser = await user.findOne({ username });
    if (fetchedUser == null) {
      return done(null, false, { message: "no user found" });
    }
    try {
      if (fetchedUser.password == password) {
        return done(null, fetchedUser);
      } else {
        return done(null, false, { message: "password didnt match" });
      }
    } catch (e) {
      done(e);
    }
  };
  passport.use(
    new LocalStartegy({ usernameField: "username" }, authenticateUser)
  );
  passport.serializeUser(async (user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const temp2 = await user.findById(id);
    return done(null, temp2);
  });
}



module.exports = initialize;
