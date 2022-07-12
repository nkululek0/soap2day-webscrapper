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
puppeteer.use(stealthPlugin());
(() => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch({ headless: false });
    const tab = yield browser.newPage();
    yield tab.goto("https://soap2day.to/enter.html");
    yield tab.waitForTimeout(3000);
    yield tab.click("#btnhome");
    yield tab.waitForNavigation();
    let tabContent = [];
    search("jurassic", "Series");
    function search(searchInput, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield tab.type("#txtSearch", searchInput);
            yield tab.click("#btnSearch");
            yield tab.waitForTimeout(3000).then(() => __awaiter(this, void 0, void 0, function* () {
                setTabContent(type);
            }));
            return "";
        });
    }
    function setTabContent(type) {
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
    // function getTabContent() {}
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
    // await tab.close();
}))();
