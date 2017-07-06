const User = require('../models/user');
//showSignup
exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册'
    });
}
//showSignin
exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登陆'
    })
}
//signup
exports.signup = function(req, res) {
    var _user = req.body.user;
    User.findOne({name: _user.name}, function(err, user) {
        if(err) console.log(err);
        if(user) {
            res.redirect('/signin');
        }
        else{
            user = new User(_user);
            user.save(function(err, user) {
                if(err) console.log(err);
                res.redirect('/');
            });
        }

    });

}
//signin
exports.signin = function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({name: name}, function(err, user){
        if(err) console.log(err);
        if(! user) {
            return res.redirect('/signup');
        }
        user.comparePassword(password, function(err, isMatch) {
            if(err) console.log(err);
            console.log(isMatch);
            if(isMatch) {
                console.log('password is matched');
                req.session.user = user;
                return res.redirect('/');
            }
            else{
                console.log('password is not matched!');
                return res.redirect('/signin');
            }
        });


    });
}
//logout
exports.logout = function(req, res) {
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/');
}
//userlist
exports.list = function(req, res) {
    User.fetch(function(err, users) {
        if(err) console.log(err);
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        });
    });
}
//midware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;
    if(! user) return res.redirect('/signin');
    next();
}
//midware for admin
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;
    if(user.role < 10) return res.redirect('/');
    next();
}