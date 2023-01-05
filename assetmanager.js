//Author Seth Ladd and modified by Chris Marriot
class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    };

    // creates a queue of material the needs to be downloaded
    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    // checks length of download queue against total number of succesful/unsuccesful downloads
    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    // Will attempt to download eveything that was put into download queue
    // downloads both audio and image files
    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (var i = 0; i < this.downloadQueue.length; i++) {
            //var that = this;

            var path = this.downloadQueue[i];
            console.log(path);
            var ext = path.substring(path.length - 3);

            switch (ext) {
                case 'jpg':
                case 'png':
                    var img = new Image();
                    img.addEventListener("load", () => {
                        console.log("Loaded " + this.src);
                        //that.successCount++;
                        this.successCount++;
                        if (this.isDone() /*that.isDone()*/) callback();
                    });

                    img.addEventListener("error", () => {
                        console.log("Error loading " + this.src);
                        //that.errorCount++;
                        this.errorCount++;
                        if (this.isDone() /*that.isDone()*/) callback();
                    });

                    img.src = path;
                    this.cache[path] = img;
                    break;
                case 'wav':
                case 'mp3':
                case 'mp4':
                    var aud = new Audio();
                    aud.addEventListener("loadeddata",  () => {
                        console.log("Loaded " + this.src);
                        //that.successCount++;
                        this.successCount++;
                        if (this.isDone() /*that.isDone()*/) callback();
                    });

                    aud.addEventListener("error", () => {
                        console.log("Error loading " + this.src);
                        //that.errorCount++;
                        this.errorCount++;
                        if (this.isDone()/*that.isDone()*/) callback();
                    });

                    aud.addEventListener("ended", () => {
                        aud.pause();
                        aud.currentTime = 0;
                    });

                    aud.src = path;
                    aud.load();

                    this.cache[path] = aud;
                    break;
            }
        }
    };

    // Get and assest from the cache
    getAsset(path) {
        return this.cache[path];
    };

    playAsset(path) {
        let audio = this.cache[path];
        audio.currentTime = 0;
        audio.play();
    };

    muteAudio(mute) {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.muted = mute;
            }
        }
    };

    adjustVolume(volume) {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.volume = volume;
            }
        }
    };

    pauseBackgroundMusic() {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.pause();
                asset.currentTime = 0;
            }
        }
    };

    autoRepeat(path) {
        var aud = this.cache[path];
        aud.addEventListener("ended", function () {
            aud.play();
        });
    };
};