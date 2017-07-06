const crypto = require('crypto');
const bcrypt = require('bcryptjs');
function getRandomString(len) {
    if(! len) len = 16;
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}
const should = require('should');
const app = require('../../app');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const User = mongoose.model('User');
var user;
//test
describe('<Unit Test', function() {
    describe('Model User:', function() {
        before(function (done) {
            user = {
                name: getRandomString(),
                password: 'password'
            };
            done();
        });
        describe('Before Method save', function() {
            it('Should have existed this user', function(done) {
                User.find({name: user.name}, function(err, users) {
                    users.should.have.length(0);
                    done();
                });
            });
        });
        describe('User save', function() {
            it('Should save without problem', function(done) {
                var _user = new User(user);
                _user.save(function(err) {
                    should.not.exist(err);
                    _user.remove(function(err) {
                        should.not.exist(err);
                        done();
                    })
                });
            });

            it('Should password be hashed correctly', function(done) {
                var _user = new User(user);
                var password = user.password;
                _user.save(function(err) {
                    should.not.exist(err);
                    _user.password.should.not.have.length(0);
                    bcrypt.compare(password, _user.password, function(err, isMatch) {
                        should.not.exist(err);
                        isMatch.should.equal(true);
                        _user.remove(function(err) {
                            should.not.exist(err);
                            done();
                        })
                    });
                });
            });

            it('Should user role be 0', function(done) {
                var _user = new User(user);
                _user.save(function(err) {
                    _user.role.should.equal(0);
                    _user.remove(function(err) {
                        done();
                    });
                });
            });

            it('Should user already exists', function(done) {
                var _user1 = new User(user);
                _user1.save(function(err) {
                    should.not.exist(err);
                    var _user2 = new User(user);
                    _user2.save(function(err) {
                        should.exist(err);
                        _user1.remove(function(err) {
                            if(! err) {
                                _user2.remove(function(err) {
                                    done();
                                });
                            }
                        });
                    });
                });
            });
        });
        after(function(done) {
            done()
        });
    });
});