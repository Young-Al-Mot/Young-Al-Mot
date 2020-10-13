var template = require('./lib/template.js');

exports.login = function(request, response){
    var html = template.HTML(`
        <form action="/main" method="post">
            <input type="text" name="user_id" placeholder="id">
            <p><input type="password" name="password" placeholder="password">
            <p><input type="submit" value="sign in">
        </form>
        <a href="/member"><input type="submit" value="sign up"></a>
    `);
    response.writeHead(200);
    response.end(html);
};