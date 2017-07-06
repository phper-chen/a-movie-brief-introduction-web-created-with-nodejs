const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Movie = require('../app/controllers/movie');
const Comment = require('../app/controllers/comment');
const Category = require('../app/controllers/category');
module.exports = function(app) {
    //pre handle user
    app.use(function(req, res, next) {
        var _user = req.session.user;
        app.locals.user = _user;
        next();
    });
//index
    app.get('/', Index.index);
//user
    app.post('/user/signup', User.signup);
    app.post('/user/signin', User.signin);
    app.get('/signup', User.showSignup);
    app.get('/signin', User.showSignin);
    app.get('/logout', User.logout);
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
//movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.save);
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
    app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.savePoster, Movie.new);
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
    app.delete('/admin/movie/list', Movie.del);
//comment
    app.post('/movie/comment', User.signinRequired, Comment.save);
//category
    app.get('/admin/category', User.signinRequired, User.adminRequired, Category.save);
    app.post('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
    app.get('/admin/categorylist', User.signinRequired, User.adminRequired, Category.list);
//results
    app.get('/results', Index.search);
};