var testHttp=require("./HttpProxy");
var o=testHttp();
o.listen(8888, function () {
    console.log("http-proxy 8888");
});