export default class Movie {
    constructor(title) {
        this.title = title;
        this.type = "Movie";
        this.downloadList = [];
    }
    setDownloadList(list) {
        this.downloadList.push({ name: list[0], link: list[1] });
    }
    getDownloadList() {
        return this.downloadList;
    }
}
