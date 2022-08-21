var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Movie from "./class-modules/movie.js";
import Series from "./class-modules/series.js";
import Downloader from "./class-modules/downloader.js";
import readline from "readline";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(stealthPlugin());
let tabContent = [];
let Resource;
let resourceBuilder = { type: 0 };
const ConsolePrompt = readline.createInterface({ input: process.stdin, output: process.stdout });
var Options;
(function (Options) {
    Options[Options["null"] = 0] = "null";
    Options[Options["MOVIE"] = 1] = "MOVIE";
    Options[Options["SERIES"] = 2] = "SERIES";
    Options[Options["SEASON"] = 3] = "SEASON";
})(Options || (Options = {}));
;
(() => __awaiter(void 0, void 0, void 0, function* () {
    const Browser = yield puppeteer.launch({
        headless: false,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    });
    const Tab = yield Browser.newPage();
    yield Tab.goto("https://soap2day.to/enter.html");
    yield Tab.waitForTimeout(1500);
    yield Tab.click("#btnhome");
    yield Tab.waitForNavigation();
    selectQuestion(1);
    // main program that asks user questions
    function selectQuestion(option) {
        return __awaiter(this, void 0, void 0, function* () {
            const isWithinRange = option >= 1 && option <= 3;
            if (isWithinRange) {
                if (option === 1) {
                    ConsolePrompt.question("\nSearch: ", (search) => __awaiter(this, void 0, void 0, function* () {
                        yield Tab.type("#txtSearch", search);
                        yield Tab.click("#btnSearch");
                        yield Tab.waitForSelector(".no-padding");
                        selectQuestion(2);
                    }));
                }
                if (option === 2) {
                    ConsolePrompt.question("\n1.Movie\n2.Series\n\nSelect Option: ", (resource) => {
                        const isValidOption = resource === "1" || resource == "2";
                        if (!isValidOption) {
                            console.log("invalid option");
                            selectQuestion(2);
                        }
                        else if (isValidOption) {
                            resourceBuilder.type = Number(resource);
                            selectQuestion(3);
                        }
                    });
                }
                if (option === 3) {
                    if (resourceBuilder.type === Options.MOVIE) {
                        yield setTabContent("Movie", Tab);
                    }
                    else if (resourceBuilder.type === Options.SERIES) {
                        yield setTabContent("Series", Tab);
                    }
                    else if (resourceBuilder.type === Options.SEASON) {
                        yield setTabContent("Season", Tab);
                    }
                    if (tabContent[0].name === "no match found") {
                        console.log("no match found in that category");
                        selectQuestion(2);
                    }
                    else {
                        console.log("\n");
                        tabContent.map(({ name }, index) => { console.log(`${++index}.${name}`); });
                    }
                    ConsolePrompt.question("\nSelect Option: ", (answer) => __awaiter(this, void 0, void 0, function* () {
                        const isValidOption = Number(answer) >= 1 && Number(answer) <= tabContent.length;
                        if (!isValidOption) {
                            console.log("invalid input");
                            selectQuestion(3);
                        }
                        else {
                            // this destructures the name and url within the tabContent from the selected options 
                            const { url, name } = tabContent[Number(answer) - 1];
                            if (resourceBuilder.type === Options.MOVIE) {
                                Resource = new Movie(name);
                                Resource.setDownloadList([url, name]);
                                yield launchDownloader(Resource.resourceType);
                            }
                            else if (resourceBuilder.type === Options.SERIES) {
                                Resource = new Series(name);
                                tabContent.map(({ url, name }) => { Resource.setDownloadList([url, name]); });
                            }
                        }
                    }));
                }
            }
        });
    }
    // downloads content in downloadList based off of resource type
    function launchDownloader(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMovie = resource === "Movie";
            if (isMovie) {
                const { url } = Resource.getDownloadList()[0];
                executeDownload(url, Resource);
            }
            function executeDownload(url, resource) {
                return __awaiter(this, void 0, void 0, function* () {
                    const DownloadPage = yield Browser.newPage();
                    yield DownloadPage.goto(url.href);
                    yield DownloadPage.waitForSelector("video");
                    const DownloadLink = yield DownloadPage.$eval("video", video => video.src);
                    const ResourceTitle = resource.title;
                    const MovieDownloader = new Downloader(new URL(DownloadLink), `${ResourceTitle}.mp4`);
                    MovieDownloader.download(ResourceTitle);
                });
            }
        });
    }
    // populates tabContent based on the content of the current page and type
    function setTabContent(resourceType, tab) {
        return __awaiter(this, void 0, void 0, function* () {
            tabContent = [];
            let resourceTypeSection = yield tab.$$("div.panel-body");
            if (resourceType === "Movie") {
                const isAnchorElement = yield resourceTypeSection[0].$(".no-padding a");
                if (isAnchorElement === null) {
                    yield formatTabContent("no match", null);
                }
                else {
                    yield formatTabContent("match", resourceTypeSection[0]);
                }
            }
            else if (resourceType === "Series") {
                const isAnchorElement = yield resourceTypeSection[1].$(".no-padding a");
                if (isAnchorElement === null) {
                    yield formatTabContent("no match", null);
                }
                else {
                    yield formatTabContent("match", resourceTypeSection[1]);
                }
            }
            else if (resourceType.includes("Season")) {
                resourceTypeSection = (yield tab.$$("div.alert-info-ex"));
                resourceTypeSection.reverse();
                const resourceIndex = Number(resourceType.split(" ")[1]) - 1;
                yield formatTabContent("match-season", resourceTypeSection[resourceIndex]);
            }
        });
    }
    ;
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
                    const content = yield selector.$$eval(anchorSection, (anchors) => {
                        return anchors.map((anchor) => {
                            let mediaAnchor = anchor.querySelector("a");
                            return [anchor.textContent, mediaAnchor.href];
                        });
                    });
                    content.map((item) => {
                        tabContent.push({ name: item[0], url: new URL(item[1]) });
                    });
                });
            }
        });
    }
}))();
