const Category = require('../models/category');
const Movie = require('../models/movie');
//index page
exports.index = function(req, res) {
    // console.log(req.session.user);
    Category
        .find({})
        .populate({path: 'movies', options: {limit: 5}})
        .exec(function(err, categories) {
            if(err) console.log(err);
            console.log(categories);
            res.render('index', {
                title: '我的电影 首页',
                categories: categories
            });
        });
}
//search
exports.search = function(req, res) {
    var catId = req.query.cat;
    var q = req.query.q;
    var page = parseInt(req.query.p, 10) || 0;
    const count = 2;
    var index = page*count;//从第几条开始
    if(catId) {
        Category
            .find({_id: catId})
            .populate({
                path: 'movies',
                select: 'title poster'
            })
            .exec(function(err, category) {
                if(err) console.log(err);
                var category = category[0] || {};
                var movies = category.movies || [];
                var results = movies.slice(index, index+count);
                console.log(category.movies);
                res.render('results', {
                    title: '我的电影结果列表页面',
                    keyword: category.name,
                    currentPage: ~~page+1,
                    query: 'cat=' + catId,
                    totalPage: Math.ceil(movies.length/count),
                    movies: results
                });
            });
    }
    else {
        Movie
            .find({title: new RegExp(q + '.*', 'i')})
            .exec(function(err, movies) {
                if(err) console.log(err);
                var results = movies.slice(index, index+count);
                res.render('results', {
                    title: '我的电影结果列表页面',
                    keyword: q,
                    currentPage: ~~page+1,
                    query: 'cat=' + q,
                    totalPage: Math.ceil(movies.length/count),
                    movies: results
                });
            });
    }

}