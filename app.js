const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const multiparty = require('connect-multiparty');
const mongoStore = require('connect-mongo')(session);
const logger = require('morgan');
const port = process.env.PORT || 3000;
const app = express();
const dbUrl = 'mongodb://localhost/imooc';
const fs = require('fs');
mongoose.connect(dbUrl);
const models_path = __dirname + '/app/models';
const walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);
            if(stat.isFile()) {
                if(/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath);
                }
            }else if(stat.isDirectory()) {
                walk(newPath);
            }
        })
};
walk(models_path);
app.set('views', './app/views/pages');
app.set('view engine', 'pug');
app.use(bodyParser.json());// for parsing application/json
app.use(bodyParser.urlencoded({extended: true}));// for parsing application/x-www-form-urlencoded
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));
app.use(multiparty());
var env = process.env.NODE_ENV || 'development';
if ('development' === env) {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}
app.locals.moment = require('moment');
require('./config/routes')(app);
app.listen(port);
console.log('服务开启于' + port);