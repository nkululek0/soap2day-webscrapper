import fs, { existsSync, mkdirSync } from "fs";
import https from "https";
import logUpdate from "log-update";
export default class downloader {
    constructor(url, filename) {
        this.url = url;
        this.filename = filename;
    }
    download(consoleOutput) {
        if (!existsSync("./download")) {
            mkdirSync("./download");
        }
        const FormattedFilename = this.formatFilename(this.filename);
        if (!existsSync(`./download/${FormattedFilename}`)) {
            https.get(this.url.href, (res) => {
                const FileStream = fs.createWriteStream(`./download/${FormattedFilename}`);
                res.pipe(FileStream);
                const FileSize = Number(res.headers["content-length"]);
                res.on("data", () => {
                    let writtenBytes = Number(FileStream.bytesWritten);
                    let downloadStatus = this.userReadableFormat(FileSize, writtenBytes);
                    logUpdate(`downloading: \n - ${consoleOutput}: ${downloadStatus}`);
                });
                res.on("close", () => {
                    FileStream.close();
                    console.log(` - ${consoleOutput}: complete`);
                });
            });
        }
        else {
            console.log(`${FormattedFilename} already exists!`);
        }
    }
    userReadableFormat(totalBytes, writtenBytes) {
        let fileSize = String(totalBytes);
        let percentage = ((writtenBytes / totalBytes) * 100).toFixed(2);
        if (totalBytes > 999999999) {
            fileSize = fileSize.slice(0, 3);
            fileSize = `${fileSize[0]},${fileSize[1]}${fileSize[2]}`;
            return `${percentage}% of ${fileSize}GB`;
        }
        if (totalBytes > 99999999) {
            fileSize = fileSize.slice(0, 5);
            fileSize = `${fileSize[0]}${fileSize[1]}${fileSize[2]},${fileSize[3]}${fileSize[4]}`;
            return `${percentage}% of ${fileSize}MB`;
        }
        if (totalBytes > 9999999) {
            fileSize = fileSize.slice(0, 4);
            fileSize = `${fileSize[0]}${fileSize[1]},${fileSize[2]}${fileSize[3]}`;
            return `${percentage}% of ${fileSize}MB`;
        }
        if (totalBytes > 999999) {
            fileSize = fileSize.slice(0, 3);
            fileSize = `${fileSize[0]},${fileSize[1]}${fileSize[2]}`;
            return `${percentage}% of ${fileSize}MB`;
        }
        return `${percentage}%`;
    }
    formatFilename(filename) {
        return filename.split(" ").map((word) => {
            return word.replace(word[0], word[0].toLowerCase());
        }).join("-");
    }
}
