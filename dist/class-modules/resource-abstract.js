export default class ResourceAbstract {
    constructor(resourceType) {
        this.resourceType = resourceType;
        this.downloadList = [];
    }
    setDownloadList(list) {
        const [url, name] = list;
        this.downloadList.push({ url, name });
    }
    getDownloadList() {
        return this.downloadList;
    }
}
