module.exports = {
  HTML:function(body){
    return `
    <!doctype html>
    <html>
    <head>
      <title>login</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${body}
    </body>
    </html>
    `;
  }
}
