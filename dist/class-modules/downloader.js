import https from "https";
import fs from "fs";
import logUpdate from "log-update";
export default class Downloader {
    constructor(url, filename) {
        this.url = url;
        this.filename = filename;
    }
    donwload(consoleOutput) {
        https.get(this.url, (response) => {
            let fileStream = fs.createWriteStream(`${this.filename}`);
            response.pipe(fileStream);
            const fileLength = Number(response.headers["content-length"]);
            response.on("data", () => {
                logUpdate(`downloading: \n - ${consoleOutput}: ${((fileStream.bytesWritten / fileLength) * 100).toFixed(2)}%`);
            });
            response.on("end", () => {
                fileStream.close();
                console.log(` - ${consoleOutput}: complete`);
            });
        });
    }
}
