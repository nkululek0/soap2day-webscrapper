var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import readline from "readline";
import Movie from "./class-modules/movie.js";
import Series from "./class-modules/series.js";
import Downloader from "./class-modules/downloader.js";
puppeteer.use(stealthPlugin());
(() => __awaiter(void 0, void 0, void 0, function* () {
    let tabContent = [];
    let mainObject;
    const consolePrompt = readline.createInterface({ input: process.stdin, output: process.stdout });
    let options;
    (function (options) {
        options[options["movie"] = 0] = "movie";
        options[options["series"] = 1] = "series";
        options[options["season"] = 2] = "season";
    })(options || (options = {}));
    ;
    let userInput = 0;
    consolePrompt.question("1.Movie\n2.Series\nSelect Option: ", (answer) => {
        if (answer === "1") {
            userInput = options.movie;
        }
        else if (answer === "2") {
            userInput = options.series;
        }
        else {
            console.log("invalid input");
        }
        consolePrompt.question("Search: ", (answer) => __awaiter(void 0, void 0, void 0, function* () {
            const browser = yield puppeteer.launch();
            const tab = yield browser.newPage();
            yield tab.goto("https://soap2day.to/enter.html");
            yield tab.waitForTimeout(1500);
            yield tab.click("#btnhome");
            yield tab.waitForNavigation();
            if (userInput === options.movie) {
                mainObject = new Movie(answer);
            }
            else if (userInput === options.series) {
                mainObject = new Series(answer);
            }
            yield search(mainObject.title, tab);
            yield setTabContent(mainObject.type, tab);
            yield tab.waitForTimeout(1000).then(() => {
                console.log("Donwload Options:");
                tabContent.map((item, index) => {
                    console.log(`${++index}. ${item.name}`);
                });
                consolePrompt.question("Select Option: ", (answer) => __awaiter(void 0, void 0, void 0, function* () {
                    let numAnswer = Number(answer) - 1;
                    if (userInput === options.movie) {
                        yield tab.goto(tabContent[numAnswer].url);
                        yield tab.waitForSelector("video");
                        let downLoadSrc = yield tab.$eval("video", (video) => {
                            return video.src;
                        });
                        const downloader = new Downloader(downLoadSrc, `${tabContent[numAnswer].name}.mp4`);
                        downloader.donwload(tabContent[numAnswer].name);
                        yield browser.close();
                    }
                }));
            });
        }));
    });
    // searches user console input
    function search(searchInput, tab) {
        return __awaiter(this, void 0, void 0, function* () {
            yield tab.type("#txtSearch", searchInput);
            yield tab.click("#btnSearch");
            yield tab.waitForSelector(".no-padding");
        });
    }
    // populates tabContent based on the content of the current page and type
    function setTabContent(type, tab) {
        return __awaiter(this, void 0, void 0, function* () {
            const typeSection = yield tab.$$(".panel-body");
            if (type === "Movie") {
                let exits = yield typeSection[0].$(".no-padding a");
                if (exits === null) {
                    formatTabContent("no match", null);
                }
                else {
                    formatTabContent("match", typeSection[0]);
                }
            }
            if (type === "Series") {
                let exits = yield typeSection[1].$(".no-padding a");
                if (exits == null) {
                    formatTabContent("no match", null);
                }
                else {
                    formatTabContent("match", typeSection[1]);
                }
            }
            if (type === "Season") {
            }
        });
    }
    // does the formating for setContent so that setContent is DRY
    function formatTabContent(match, selector) {
        return __awaiter(this, void 0, void 0, function* () {
            if (match === "no match") {
                tabContent.push({ name: "no match found", url: "" });
            }
            else {
                selector = selector;
                let content = yield selector.$$eval(".no-padding h5", (links) => {
                    return links.map((link) => {
                        let mediaLink = link.querySelector("a");
                        return [link.textContent, mediaLink.href];
                    });
                });
                content.map((item) => {
                    tabContent.push({ name: item[0], url: item[1] });
                });
            }
        });
    }
}))();
