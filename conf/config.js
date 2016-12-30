var config = {}
var envConfig = {}

config.DEFAULT_PORT = 9082;
config.LOGDIR = "/data/webapps/transcode-node.v.huya.com/log";
config.TS_PATH = '/data1/video_dot_cloud';
config.M3U8_PATH = '/data1/video_dot_cloud';
config.M3U8_HOST = 'http://transcode-node.v.huya.com/hls/';
config.ENCODE = {
    'segment_time': 30,
    'definitions': {
        '360p': {
            "resolution": "640x360",
            'bandwidth': "1945000",
            'encodeParams':{
                '-f': "mpegts",
                '-vcodec': "libx264",
                '-acodec': "copy",
                '-b:v': "400k",
                '-b:a': "32k",
                '-ar': "44100",
                '-threads': "1",
                '-vf': "scale=-2:360",
                '-profile:v': 'baseline',   //baseline
            },
            'extraParams': [
            ],
        },
        '480p': {
            "resolution": "854x480",
            'bandwidth': "3795000",
            'encodeParams':{
                '-f': "mpegts",
                '-vcodec': "libx264",
                '-acodec': "copy",
                '-b:v': "800k",
                '-b:a': "64k",
                '-ar': "44100",
                '-threads': "1",
                '-vf': "scale=-2:480",
                '-profile:v': 'high',   //baseline
            },
            'extraParams': [
            ],
        },
        '720p': {
            "resolution": "1280x720",
            'bandwidth': "9600000",
            'encodeParams':{
                '-f': "mpegts",
                '-vcodec': "libx264",
                '-acodec': "copy",
                '-b:v': "1080k",
                '-b:a': "64k",
                '-ar': "44100",
                '-threads': "4",
                '-vf': "scale=-2:720",
                '-profile:v': 'high',   //baseline
            },
            'extraParams': [
                "-preset",
                "veryfast",
            ],
        },
        'yuanhua': {
            "resolution": "1920x1080",
            'bandwidth': "21705000",
            copy: true,
        },
        /*'1080p': {
            'encodeParams':{
                '-f': "mpegts",
                '-vcodec': "libx264",
                '-acodec': "libfdk_aac",
                '-b:v': "1500k",
                '-b:a': "128k",
                '-ar': "44100",
                '-threads': "1",
                '-vf': "scale=-2:1080",
                '-profile:v': 'high',   //baseline
            },
            'extraParams': [
            ],
        },*/
    }
}

if(global.__ENV__ == "dev"){
    config = Object.assign(config, require("./config-dev"));
}else if(global.__ENV__ == "test"){
    config = Object.assign(config, require("./config-test"));
}else{
    config = Object.assign(config, require("./config-pro"));
}

config.getRateParam = function(rate, defaultValue){
    if(config.ENCODE.definitions.hasOwnProperty(rate)){
        return config.ENCODE.definitions[rate]
    }else{
        return defaultValue
    }
}
module.exports = config;