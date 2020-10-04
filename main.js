var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'emost22',
    database:'yam'
});
db.connect();

exports.main = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.user_id;
        var password = post.password;

        db.query(
            `SELECT * FROM user WHERE user_id=?`, [id],
            function(error, results){
                if(error) throw error;

                if(!results[0]) {
                    var html = template.HTML(
                        `<script>
                            alert('plz check id');
                            window.history.back();
                        </script>`
                    );
                    response.end(html);
                }
                else{
                    if(password == results[0].password){
                        response.writeHead(200);
                        response.end(`hello, ${id}`);
                    }
                    else{
                        var html2 = template.HTML(
                            `<script>
                                alert('plz check password');
                                window.history.back();
                            </script>`
                        );
                        response.end(html2);
                    }
                }
            }
        );
    });
};