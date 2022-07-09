export default class Movie {
    constructor(title) {
        this.title = title;
        this.type = "Movie";
        this.downloadList = [];
    }
    getDownloadList() {
        return this.downloadList;
    }
    setDownloadList(list) {
        this.downloadList.push({ name: list[0], url: list[1] });
    }
}
