var qs = require('querystring');
var template = require('./lib/template.js');
var mysql = require('mysql');
var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'emost22',
    database:'yam'
});
db.connect();

exports.create = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.user_id;
        var password = post.password;
        var name = post.user_name;
        var email = post.email;

        db.query(
            `SELECT * FROM user WHERE user_id=?`, [id],
            function(error, results){
                if(error) throw error;

                if(results[0]) {
                    var html = template.HTML(
                        `<script>
                            alert('id already exists.');
                            window.history.back();
                        </script>`
                    );
                    response.end(html);
                }
                else{
                    if(password.length < 8){
                        var html2 = template.HTML(
                            `<script>
                                alert('password must be written at least 8 characters.');
                                window.history.back();
                            </script>`
                        );
                        response.end(html2);
                    }
                    else{
                        db.query(
                            `SELECT * FROM user WHERE user_name=?`,[name],
                            function(error3, results3){
                                if(error3) throw error3;

                                if(results3[0]){
                                    var html3 = template.HTML(
                                        `<script>
                                            alert('name already exists.');
                                            window.history.back();
                                        </script>`
                                    );
                                    response.end(html3);
                                }
                                else{
                                    db.query(
                                        `SELECT * FROM user WHERE email=?`,[email],
                                        function(error4, results4){
                                            if(error4) throw error4;
        
                                            if(results4[0]){
                                                var html4 = template.HTML(
                                                    `<script>
                                                        alert('email already exists.');
                                                        window.history.back();
                                                    </script>`
                                                );
                                                response.end(html4);
                                            }
                                            else{
                                                var post = qs.parse(body);

                                                db.query(
                                                    `INSERT INTO user(user_id, password, user_name, email)
                                                    VALUES(?, ?, ?, ?)`,
                                                    [id, password, name, email],
                                                    function(error, result){
                                                        if(error) throw error;
                                                        
                                                        response.writeHead(302, {Location: `/`});
                                                        response.end();
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            }
        );
    });
};