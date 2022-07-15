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
        consolePrompt.question("\nSearch: ", (answer) => __awaiter(void 0, void 0, void 0, function* () {
            const browser = yield puppeteer.launch({ headless: false });
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
            yield setTabContent(mainObject.resourceType, tab);
            yield tab.waitForTimeout(1000).then(() => {
                console.log("\nDonwload Options:");
                tabContent.map((item, index) => {
                    console.log(`${++index}.${item.name}`);
                });
                consolePrompt.question("\nSelect Option: ", (answer) => __awaiter(void 0, void 0, void 0, function* () {
                    let numAnswer = Number(answer) - 1;
                    if (userInput === options.movie) {
                        yield tab.goto(tabContent[numAnswer].url);
                        yield tab.waitForSelector("video");
                        let downLoadSrc = yield tab.$eval("video", (video) => {
                            return video.src;
                        });
                        mainObject.setDownloadList([tabContent[numAnswer].name, downLoadSrc]);
                        const downloader = new Downloader(mainObject.getDownloadList()[0].url, `${mainObject.getDownloadList()[0].name}.mp4`);
                        downloader.donwload(mainObject.getDownloadList()[0].name);
                        yield browser.close();
                    }
                    else if (userInput === options.series) {
                        yield tab.goto(tabContent[numAnswer].url);
                        let seasonList = yield tab.$$("div.alert-info-ex");
                        seasonList.map((seasonOption, index) => {
                            console.log(`${++index}.Season ${index}`);
                        });
                        consolePrompt.question("\nSelect Season: ", (season) => __awaiter(void 0, void 0, void 0, function* () {
                            let donwloadPage = yield browser.newPage();
                            mainObject.setSeason(`Season ${season}`);
                            yield setTabContent(`Season ${season}`, tab);
                            yield donwloadPage.waitForTimeout(1000).then(() => {
                                tabContent.reverse();
                                tabContent.map((episode) => {
                                    console.log(episode.name);
                                });
                            });
                            consolePrompt.question("\n1.Download All | 2.Select: ", (downloadOption) => {
                                let startEpisode = -1;
                                let endEpisode = -1;
                                let excludeEpisodes = [];
                                if (downloadOption === "1") {
                                }
                                else if (downloadOption === "2") {
                                    consolePrompt.question("Download From Episode: ", (answer) => {
                                        startEpisode = Number(answer);
                                        consolePrompt.question("Stop Download at Episode: ", (answer) => {
                                            endEpisode = Number(answer);
                                            consolePrompt.question("Episodes to Exclude: ", (answer) => {
                                                excludeEpisodes = answer.split(", ").map((number) => Number(number) - 1);
                                            });
                                        });
                                    });
                                    tabContent.map((episode, index) => {
                                        if (excludeEpisodes.some((exEpisode) => exEpisode !== index)) {
                                            mainObject.setDownloadList([episode.name, episode.url]);
                                        }
                                    });
                                    console.log(mainObject.getDownloadList());
                                }
                            });
                        }));
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
    function setTabContent(resourceType, tab) {
        return __awaiter(this, void 0, void 0, function* () {
            tabContent = [];
            let resourceTypeSection = yield tab.$$("div.panel-body");
            if (resourceType === "Movie") {
                let exits = yield resourceTypeSection[0].$(".no-padding a");
                if (exits === null) {
                    yield formatTabContent("no match", null);
                }
                else {
                    yield formatTabContent("match", resourceTypeSection[0]);
                }
            }
            else if (resourceType === "Series") {
                let exits = yield resourceTypeSection[1].$(".no-padding a");
                if (exits == null) {
                    yield formatTabContent("no match", null);
                }
                else {
                    yield formatTabContent("match", resourceTypeSection[1]);
                }
            }
            else if (resourceType.includes("Season")) {
                resourceTypeSection = (yield tab.$$("div.alert-info-ex"));
                let resourceIndex = Number(resourceType.split(" ")[1]) - 1;
                yield formatTabContent("match-season", resourceTypeSection[resourceIndex]);
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
                if (match === "match") {
                    yield format(".no-padding h5");
                }
                else if (match === "match-season") {
                    yield format(".myp1");
                }
            }
            function format(anchorSection) {
                return __awaiter(this, void 0, void 0, function* () {
                    selector = selector;
                    let content = yield selector.$$eval(anchorSection, (anchors) => {
                        return anchors.map((anchor) => {
                            let mediaAnchor = anchor.querySelector("a");
                            return [anchor.textContent, mediaAnchor.href];
                        });
                    });
                    content.map((item) => {
                        tabContent.push({ name: item[0], url: item[1] });
                    });
                });
            }
        });
    }
}))();
