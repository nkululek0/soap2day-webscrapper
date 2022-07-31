import ResourceAbstract from "./resource-abstract.js";
export default class Series extends ResourceAbstract {
    constructor(title) {
        super("Series");
        this.title = title;
        this.season = "";
    }
    getSeason() {
        return this.season;
    }
    setSeason(season) {
        this.season = season;
    }
}
