import ResourceAbstract from "./resource-abstract.js";
export default class Movie extends ResourceAbstract {
    constructor(title) {
        super("Movie");
        this.title = title;
    }
}
