module.exports = extractUser;

const passport = require('passport');

function extractUser() {
    return [
        (req, res, next) => {
            passport.authenticate('jwt', function (err, user, info) {
                if (err) {
                    req.user = null;
                    return next();
                } else {
                    req.user = user;
                    return next();
                }
            })(req, res, next);
        }
    ];
}
