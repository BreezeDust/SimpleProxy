function createHttpProxy(){
    var http = require('http');
    var URL = require('url');

    function toHttpProxy(request,response,urlObj,body){
        var options = {
            host: request.headers.host,
            port:80,
            path: urlObj.path,
            method: request.method
        };
        options.headers=request.headers;
        console.log(options.path+" "+options.method);
        var httpRequest = http.request(options, function(res) {
            response.writeHead(res.statusCode,res.headers);
            res.on('data', function(chunk) {
                response.write(chunk,"binary");
            });
            res.on('end', function(){
                response.end();
            });
        });
        httpRequest.write(body);
        httpRequest.end();
    }
    var server = http.createServer(function(request, response) {
        var pUrl=URL.parse(request.url);
        if(request.method=="get" || request.method=="GET"){
            toHttpProxy(request,response,pUrl,"");
        }
        else{
            request.setEncoding('utf-8');
            var postData = "";
            request.addListener("data", function (postDataChunk) {
                postData += postDataChunk;
            });
            request.addListener("end", function () {
                console.log("post body:"+postData);
                toHttpProxy(request,response,pUrl,postData);
            });
        }
    });
    return server;
}
module.exports=createHttpProxy;
