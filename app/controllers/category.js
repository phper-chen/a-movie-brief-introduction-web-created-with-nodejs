const Category = require('../models/category');
exports.save = function(req, res) {
    res.render('category_admin', {
        title: 'imooc 分类录入页'
    });
}
exports.new = function(req, res) {
    var categoryObj = req.body.category;
    var _category = new Category(categoryObj);
    _category.save(function(err, category ) {
        if(err) console.log(err);
        res.redirect('/admin/categorylist');
    });
}
exports.list = function(req, res) {
    Category.fetch(function(err, categories) {
        if(err) console.log(err);
        res.render('categorylist', {
            title: 'imooc 分类列表页',
            categories: categories
        });
    });
}