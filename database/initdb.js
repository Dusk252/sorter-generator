print('Start #################################################################');

db.createCollection('users');
db.createCollection('sorters');
db.createCollection('sorter_results');
db.createCollection('refresh_tokens');

db.users.insertOne({
    _id: 'jxQhVI9C3LK',
    joined_date: Date.now(),
    friends: [],
    favorite_sorters: [],
    profile: { username: 'exUser', about_me: '', links_list: [], share_settings: {}, icon: '' },
    email: 'test@gmail.com',
    password: 'test',
    localLogin: null,
    integration3rdparty: {},
    role: null,
    account_status: 'ACTIVE'
});

print('END #################################################################');
