const express = require('express');
const app = express.Router();

const ytdl = require('ytdl-core');
const ffmpeg = require("fluent-ffmpeg");
let urls = [];

app.post("/getinfo", (req, res) => {
    let url = decodeURI(req.headers.url || "null");
    if(!url || !ytdl.validateURL(url)) return res.json({ data: { message: "Provide valid URL" }, error: true });
    ytdl.getInfo(url)
    .then(data => {
        if(data.videoDetails.isLiveContent) return res.json({ data: { message: "Can't download live videos." }, error: true })
        urls.push(data.videoDetails.video_url);
        res.json({
            title: data.videoDetails.title,
            channel: data.videoDetails.ownerChannelName || "Unknown",
            thumbnail: `https://img.youtube.com/vi/${data.videoDetails.videoId}/maxresdefault.jpg`,
            url: data.videoDetails.video_url,
            audioURL: `/download/audio?url=${data.videoDetails.video_url}`,
            videoURL: `/download/video?url=${data.videoDetails.video_url}`,
            embed: data.videoDetails.embed.iframeUrl
        });
    }).catch(e => res.json({ data: { message: "Video unavailable" }, error: true }));
})

app.get('/audio', (req, res) => {
    let url = req.query.url;
    console.log(url);
    if(!url || !ytdl.validateURL(url) || !urls.includes(url)) return res.redirect("/?s=invalid");
    ytdl.getInfo(url)
    .then(info => {
        if(info.videoDetails.isLiveContent) return res.redirect('/?s=live');
        let stream = ytdl.downloadFromInfo(info, { filter: "audioonly", quality: "highestaudio" })
        stream.on("info", async(Info, Format) => {
            await res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 32)}.mp3"`);
            await res.header('Content-Type', "audio/mp3")
            ffmpeg(stream)
            .toFormat("mp3")
            .on("error", () => {
                console.log("Error downloading audio - " + info.videoDetails.videoId);
            })
            .pipe(res, { end: true });
        })
    }).catch(e => {
        console.error(e);
        return res.redirect("/?s=unavailable");
    });
});
app.get("/video", (req, res) => {
    let url = req.query.url;
    if(!url || !ytdl.validateURL(url) || !urls.includes(url)) return res.redirect("/?s=invalid");
    ytdl.getInfo(url)
    .then(info => {
        if(info.videoDetails.isLiveContent) return res.redirect('/?s=live');
        let stream = ytdl.downloadFromInfo(info, { filter: "videoandaudio", quality: "highestvideo"/*, filter: format => format.container === 'mp4' */})
        stream.on("info", async(Info, Format) => {
            await res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 32)}.mp4"`);
            await res.header('Content-Type', "video/mp4")
            stream.pipe(res);
        })
    }).catch(e => {
        console.error(e);
        return res.redirect("/?s=unavailable");
    });
})

module.exports = app;