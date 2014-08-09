var http = require('http');
var fs = require('fs');

var reqListener = function(req, res){
  if(req.url.match(/stream$/)){
    res.writeHead(200,
                  { "Content-Type": "text/event-stream",
                    "Cache-Control":"no-cache",
                    "Connection": "keep-alive"});
    res.write("retry: 10000\n");
    res.write("event: connecttime\n");
    res.write("data:" + (new Date()) + "\n\n");

    interval = setInterval(function(){
      res.write("data: " + (new Date()) + "\n\n");
    },1000);

    req.connection.addListener("close", function(){
      clearInterval(interval);
    }, false);
  } else {
    var fileName = "." + req.url;
    fs.exists(fileName, function(isExisted){
      if(isExisted){
        fs.readFile(fileName, function(err, content){
          if(err){
            res.writeHead(500);
            res.end();
          } else {
            res.writeHead(200,
                          { "Content-Type": "text/html"});
            res.end(content, "utf-8");
          }
        });
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  }
};

http.createServer(reqListener).listen(8888);
console.log("Server running");


