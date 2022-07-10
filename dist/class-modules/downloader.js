import https from "https";
import fs from "fs";
export default class Downloader {
    constructor(url, filename) {
        this.url = url;
        this.filename = filename;
    }
    donwload(consoleOutput) {
        https.get(this.url, (response) => {
            let fileStream = fs.createWriteStream(`${this.filename}`);
            response.pipe(fileStream);
            fileStream.on("finish", () => {
                fileStream.close();
                console.log("donwload complete");
            });
        });
    }
}
