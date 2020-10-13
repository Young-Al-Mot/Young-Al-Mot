var template = require('./lib/template.js');

exports.member = function(request, response){
    var html = template.HTML(`
        <form action="/user_create" method="post">
            <input type="text" name="user_id" placeholder="id">
            <p><input type="password" name="password" placeholder="password">
            <p><input type="text" name="user_name" placeholder="name">
            <p><input type="text" name="email" placeholder="email">
            <p><input type="submit" value="sign up">
        </form>
    `);
    response.writeHead(200);
    response.end(html);
};