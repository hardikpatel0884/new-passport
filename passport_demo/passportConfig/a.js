const { User } = require('./../../models/user')

let findMyUser = (userEmail) => {
    console.log(userEmail)
    User.find({ 'email': userEmail }).then((user) => {
        console.log(user);
        return (null, user);
    }, (err) => {
        console.log(err);
        return (err, false);
    })
}

module.exports = { findMyUser }