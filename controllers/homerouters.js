const router = require('express').Router();
const {User, Post} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) =>{
    try{
    const postData = await = await Post.findAll({
        include: [{
            model: User,
            attributes: ['name'],
        },
    ],
    });
    const post = postData.map((post) => post.get({plain: true}));
    res.render("homepage", {
        post,
        logged_in: req.session.logged_in,
    });
    } catch (err) {
        res.status(500).json(err);
    }
});
// Route to get a single post by id
router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id,{
            include: [
                { model: User,
                    attributes: ["name"]
                }
            ],
        });
        const post = postData.get({ plain: true});
        res.render("post",{
            ...post,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
}
);
//route to render the dashboard (protected route)
router.get("/dashboard", withAuth, async (req,res)=> {
    try{
        // find the logged-in user based on the session ID
        const userData = await User.findByPk(req.session.user_id,{
            attributes: { exclude: ["password"]},
            include: [{ model: Post}],
        });
        const user = userData.get({ plain: true });
        res.render("dashboard", {
            ...user,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// route to render the login page
router.get("/login", (req, res) =>{
    if (req.session.logged_in) {
        res.redirect("/");
        return;
    }
    res.render("login");
});

//route to render the signup page
router.get("/signup"), (req,res) => {
    if (req.session.logged_in) {
        res.redirect("/");
        return;
    }
    res.render("signup");
});
module.exports = router;