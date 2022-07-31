export default class ResourceAbstract {
    constructor(resourceType) {
        this.resourceType = resourceType;
        this.downloadList = [];
    }
    setDownloadList(list) {
        this.downloadList.push({ url: list[0], name: list[1] });
    }
    getDownloadList() {
        return this.downloadList;
    }
}
