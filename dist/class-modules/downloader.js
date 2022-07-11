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
                let fileLength = Number(response.headers["content-length"]);
                response.on("data", () => {
                    let writtenBytes = Number(fileStream.bytesWritten);
                    let downloadStatus = this.userReadableFormat(fileLength, writtenBytes);
                    logUpdate(`downloading: \n - ${consoleOutput}: ${downloadStatus}`);
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
    userReadableFormat(totalBytes, writtenBytes) {
        let fileSize = String(totalBytes);
        let percentage = ((writtenBytes / totalBytes) * 100).toFixed(2);
        if (totalBytes > 999999999) {
            fileSize = fileSize.slice(0, 3);
            fileSize = `${fileSize[0]},${fileSize[1]}${fileSize[2]}`;
            return `${percentage} % of ${fileSize} GB`;
        }
        if (totalBytes > 99999999) {
            fileSize = fileSize.slice(0, 5);
            fileSize = `${fileSize[0]}${fileSize[1]}${fileSize[2]},${fileSize[3]}${fileSize[4]}`;
            return `${percentage} % of ${fileSize} MB`;
        }
        if (totalBytes > 9999999) {
            fileSize = fileSize.slice(0, 4);
            fileSize = `${fileSize[0]}${fileSize[1]},${fileSize[2]}${fileSize[3]}`;
            return `${percentage} % of ${fileSize} MB`;
        }
        if (totalBytes > 999999) {
            fileSize = fileSize.slice(0, 3);
            fileSize = `${fileSize[0]},${fileSize[1]}${fileSize[2]}`;
            return `${percentage} % of ${fileSize} MB`;
        }
        return `${percentage} %`;
    }
}
