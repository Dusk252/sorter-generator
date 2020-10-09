const db = require('./../api/db');
const userNumber = 10;
const accountState = require('../api/_helpers/enum').accountState;
const role = require('../api/_helpers/enum').role;

const possibleStates = Object.values(accountState);

db.connect('mongodb://localhost:27017/', 'sorterGenerator', function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    } else {
        db.get().collection('users').drop();
        let promises = [];
        for (var i = 0; i < userNumber; i++) {
            promises.push(
                db
                    .get()
                    .collection('users')
                    .insertOne({
                        joined_date: new Date(),
                        friends: [],
                        favorite_sorters: [],
                        sorter_history: [],
                        profile: {
                            username: 'user' + i,
                            about_me: 'I exist',
                            links_list: [{ name: 'koel', link: 'https://koel.sekiei.me/' }],
                            share_settings: {},
                            icon: ''
                        },
                        email: 'email' + i,
                        password: 'password' + i,
                        role: role.USER,
                        integration3rdparty: {},
                        account_status: possibleStates[Math.floor(Math.random() * 4)]
                    })
            );
        }
        Promise.all(promises)
            .then(() => {
                console.log('Seeding successful.');
                process.exit(0);
            })
            .catch((err) => {
                console.log(err);
                process.exit(1);
            });
    }
});
