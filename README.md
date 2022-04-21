# Sorter Generator

Character sorters such made manually by editing the [same script](https://github.com/nkeronkow/revised_touhou_sort) have been a thing for years. Customizing this into any sorter isn't exactly much work. All one has to do is provide the images and replace the character and image names into the file containing the character array.

This still ends up resulting in a bunch of individual webpages (usually tumblr blogs for the ease of setup) scattered all over the internet and no way other than screenshots to share and/or revisit results.

The aim of this project is to provide a generator interface for any kind of sorter, as well as an implmentation of the sorter taking functionality that has the following features:

-   User accounts (3rd party authentication with twitter and google at the moment)
-   Sorter creation
-   Sorter taking history (user can view past results for all sorters taken)
-   Pausing a sorter halfway through - progress is saved
-   Sharing sorter results
-   Result comparison with other users
-   Favorites
-   Other assorted social functions (not yet implemented)

The current state of the repo is a minimum viable product. You can spin up your own demo instance on docker by cloning the repo and running `docker-compose up` in the command line from the folder's root. The website will then be up on localhost:3000. The contents of the spun-up database will be no more than a user account with the following credentials:

```
User: test@example.com
Password: test
```

By default this demo will not have 3rd party auth working and will save uploaded images locally. You can test these features by editing the .env.example file to include the appropriate credentials for twitter/google oauth and aws s3.

<hr/>
<br/>

## Showcase screenshots

<br/>

![Create Sorter Page](https://files.catbox.moe/hntats.png)
![Sorters Page](https://files.catbox.moe/5m699u.png)
![Sorter Example 1](https://files.catbox.moe/9q39e3.png)
![Sorter Example 2](https://files.catbox.moe/jqfwov.png)
![Sorter Example 3](https://files.catbox.moe/iyh3kq.png)
![Profile Page](https://files.catbox.moe/a9k8gn.png)
![Results Page](https://files.catbox.moe/lxib0a.png)
