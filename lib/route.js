var path = require('path')
var fs = require('fs')
var util = require("./util");
var route = require("./router");
var config = require("../conf/config");
var ffmpegHandler = require("./ffmpegHandler");

route.get("/hls-list/(.*)\.m3u8", function(req, res, params){
    var file = path.join(config.M3U8_PATH, req.reg[1] + ".m3u8")
    fs.exists(file, function(exists){
        if(exists){
            var encodes = util.getValue(config, "ENCODE.definitions", [])
            var outputs = {}
            var m3u8EncdoeList = [];
            var funs = []
            for(rate in encodes){
                var definitionConf = encodes[rate];
                var output = path.join(config.M3U8_PATH, req.reg[1] + "-" + rate + ".m3u8")
                outputs[rate] = config.M3U8_HOST + req.reg[1] + "-" + rate + ".m3u8";
                m3u8EncdoeList.push({
                    rate: rate,
                    filename: path.basename(output),
                    bandwidth: util.getValue(definitionConf, "bandwidth"),
                    resolution: util.getValue(definitionConf, "resolution",  "1920x1080"),
                })
                ffmpegHandler.createM3u8File(file, output, rate, function(err){
                    if(err) util.error(err)
                })
            }
            var m3u8List = path.join(config.M3U8_PATH, req.reg[1] + "-list.m3u8");
            var index = config.M3U8_HOST + req.reg[1] + "-list.m3u8";
            ffmpegHandler.createM3u8ListFile(m3u8List, m3u8EncdoeList);
            res.jsonOutput({code:1, index: index, list: outputs})
        }else{
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end();
        }
    })
})


route.get("/hls/(.*)(-1080p|-720p|-480p|-360p|-yuanhua)\.m3u8", function(req, res, params){

    var file = path.join(config.M3U8_PATH, req.reg[1] + req.reg[2] + ".m3u8"); 
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', "X-Requested-With");
    res.setHeader('Content-Type', 'application/html');
    res.setHeader('Content-Type', 'application/x-mpegURL');

    if(fs.existsSync(file)){
        return fs.createReadStream(file).pipe(res);
    }

    var rawFile = path.join(config.M3U8_PATH, req.reg[1] + ".m3u8"); 

    fs.exists(rawFile, function(exists){
        if(exists){
            var rate = req.reg[2].toString().substring(1);
            var rateParams = config.getRateParam(rate);
            if(!rateParams){
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end();
            }else{
                try{
                    ffmpegHandler.createM3u8File(rawFile, file, rate, function(err){
                        if(err){
                            fs.createReadStream(rawFile).pipe(res);
                            util.error(err)
                        }else{
                            fs.createReadStream(file).pipe(res);
                        }
                    })
                }catch(e){
                    util.error(e)
                }
            }
        }else{
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end();
        }

    })

});

route.get("/hls/(.*)\.m3u8", function(req, res, params){
    var file = path.join(config.M3U8_PATH, req.reg[1] + ".m3u8")
    fs.exists(file, function(exists){
        if(exists){
            var range = util.getRange(req.headers["range"])
            res.setHeader('Accept-Ranges', 'bytes')
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Access-Control-Allow-Headers', "X-Requested-With");
            res.setHeader('Content-Type', 'video/mp2t');
            res.setHeader('Connection', 'keep-alive');
            fs.createReadStream(file).pipe(res);
        }else{
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end();
        }
    })
})

route.get("/hls/(.*)\.ts", function(req, res, params){
    var file = path.join(config.TS_PATH, req.reg[1] + ".ts")
    var rate = params.get("rate", null);
    fs.exists(file, function(exists){
        if(exists){
            var range = util.getRange(req.headers["range"])
            res.setHeader('Accept-Ranges', 'bytes')
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Access-Control-Allow-Headers', "X-Requested-With");
            res.setHeader('Content-Type', 'video/mp2t');
            res.setHeader('Connection', 'keep-alive');

            var rateParams = config.getRateParam(rate);
            if(!rateParams || util.getValue(rateParams, "copy", false)){
                fs.createReadStream(file, range).pipe(res);
            }else{
                try{
                    ffmpegHandler.encodeStream(fs.createReadStream(file, range), rateParams, function(err, stream){
                        if(err){
                            fs.createReadStream(file, range).pipe(res);
                            util.error("[FILE]"+file+";"+err)
                        }else{
                            stream.pipe(res)
                        }
                    })
                }catch(e){
                    util.error(e)
                }
            }
        }else{
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end();
        }
    })
});

route.get("/resource/(.*)", function(req, res){
    var file = req.reg[1];
    fs.exists(file, function(exists){
        if(exists){
            fs.createReadStream(file).pipe(res)
        }else{
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end();
        }
    })
});