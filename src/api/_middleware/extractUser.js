module.exports = extractUser;

const passport = require('passport');

function extractUser() {
    return [
        (req, res, next) => {
            passport.authenticate('jwt', function (err, user, info) {
                if (err) {
                    console.log(err);
                    return next(err);
                } else {
                    req.user = user;
                    return next();
                }
            })(req, res, next);
        }
    ];
}
