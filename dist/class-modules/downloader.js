import https from "https";
import fs, { existsSync, mkdirSync } from "fs";
import logUpdate from "log-update";
export default class Downloader {
    constructor(url, filename) {
        this.url = url;
        this.filename = filename;
    }
    donwload(consoleOutput) {
        https.get(this.url, (response) => {
            if (!existsSync("./downloads")) {
                mkdirSync("./downloads");
            }
            if (!existsSync(`./downloads/${this.filename}`)) {
                let fileStream = fs.createWriteStream(`./downloads/${this.filename}`);
                response.pipe(fileStream);
                const fileLength = Number(response.headers["content-length"]);
                response.on("data", () => {
                    logUpdate(`downloading: \n - ${consoleOutput}: ${((fileStream.bytesWritten / fileLength) * 100).toFixed(2)}%`);
                });
                response.on("end", () => {
                    fileStream.close();
                    console.log(` - ${consoleOutput}: complete`);
                });
            }
            else {
                console.log("file already exists!");
            }
        });
    }
}
