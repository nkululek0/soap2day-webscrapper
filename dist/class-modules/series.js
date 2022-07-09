export default class Series {
    constructor(title) {
        this.title = title;
        this.type = "Series";
        this.season = "";
        this.downloadList = [];
    }
    getDownloadList() {
        return this.downloadList;
    }
    setDownloadList(list) {
        this.downloadList.push({ name: list[0], url: list[1] });
    }
    getSeason() {
        return this.season;
    }
    setSeason(season) {
        this.season = season;
    }
}
