# transcode-node


```sh
$ git clone https://github.com/pk8est/transcode-node.git
$ npm install
$ npm start
```
通过浏览器打开 http://localhost/hls-list/100-hls/vod.m3u8

```sh
{
    code: 1,
    index: "http://localhost/hls/100-hls/vod-list.m3u8",
    list: {
        360p: "http://localhost/hls/100-hls/vod-360p.m3u8",
        480p: "http://localhost/hls/100-hls/vod-480p.m3u8",
        720p: "http://localhost/hls/100-hls/vod-720p.m3u8",
        yuanhua: "http://localhost/hls/100-hls/vod-yuanhua.m3u8"
    }
}
```