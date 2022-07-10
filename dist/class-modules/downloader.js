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
                console.log(`${consoleOutput}: complete`);
            });
        });
    }
}
const url = "https://d3.s2dmax.xyz/a/t4/dexters-laboratory/s04e12.mp4?tok=6F59635333567931376B7852377344444F62413662754F643856637A525738573757425A2533446C563646363349546F66364C35645644557366425667753656794E72326B532D3649634F63374B4C376853446E4C675A5A636E6F57437847685653253344744576525A734A497052327A682533444D51574D5735567968376C684A366E6E6B437176654638433539586325334450585A4E49&valid=JHCHEscaet9Nze3IQ15tqg&t=1657475987";
const downloader = new Downloader(url, "se4-ep12-the-lab-of-tomorrow");
downloader.donwload("Dexter, Season 4, Episode 12: the-lab-of-tomorrow");
