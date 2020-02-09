const db = require('./../server/db');
const userNumber = 100000;
const possibleStates = ["Active", "Pending", "Suspended", "Deleted"];

db.connect('mongodb://localhost:27017/', 'sorterGenerator', function(err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    }
    else {
        let promises = [];
        for (var i = 0; i < userNumber; i++) {
            promises.push(
                db.get().collection('users').insertOne(
                {
                    user_info: {
                        name: "user" + i,
                        email: "email" + i,
                        password: "password" + i,
                        joined_date: new Date(), 
                        role: 'User'
                    },
                    settings: {},
                    account_status: possibleStates[Math.floor(Math.random()*4)]
                })
            );
        }
        Promise.all(promises)
        .then(() => {
            console.log('Seeding successful.');
            process.exit(0);
        })
        .catch(err => {
            console.log(err);
            process.exit(1);
        });
    }
});