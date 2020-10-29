let user = {
    base_info: {
        id: '',
        username: '',
        icon: '',
        role: role.USER
    },
    extended_info: {
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
    }
};
