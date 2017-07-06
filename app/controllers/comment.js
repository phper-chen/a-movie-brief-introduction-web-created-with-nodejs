const Comment = require('../models/comment');
//comment
exports.save = function(req, res) {
    var _comment = req.body.comment;
    var movieId = _comment.movie;
    if(_comment.cid) {
        Comment.findById(_comment.cid, function(err, comment) {
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            };
            comment.reply.push(reply);
            comment.save(function(err, comment) {
                if(err) console.log(err);
                res.redirect('/movie/' + movieId);
            });
        });
    }
    else{
        var comment = new Comment(_comment);
        comment.save(function(err, comment) {
            if(err) console.log(err);
            res.redirect('/movie/' + movieId);
        });
    }
}
//list
exports.list = function(req, res) {
    Comment.fetch(function(err, Comments) {
        if(err) console.log(err);
        res.render('list', {
            title: 'imooc 列表页',
            Comments: Comments
            // [{
            //  title:"机械战警",
            //  _id:1,
            //  doctor:'何塞.帕迪利亚',
            //  country:"美国",
            //  year:2014,
            //  poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
            //  language:"英语",
            //  flash:"http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf",
            //  summary:"《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。"
            //
            // }
            // ]

        });
    });
}
//delete
exports.del = function(req, res) {
    var id = req.query.id;
    if(id) {
        Comment.remove({_id: id}, function(err, Comment) {
            if(err) {
                console.log(err);
            }
            else{
                res.json({success: 1});
            }

        });
    }
}