class Sorter {
    name: Object = {};
    description: Object = {};
    img: string = "";
    url: string = "";
    shared: boolean = true;
    status: string = "";
    tags: string[] = [];
    created_date: Date = new Date();
    created_by: string = "";
    contributions: Object = {};
    objects: SorterItem[] = [];
    [key: string]: Object;

    public constructor (data?: Object) {
        this.fill(data);
        return this;
    }

    fill (newFields?: any) {
        for (let field in newFields) {
            if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
                if (this[field] !== 'undefined') {
                    this[field] = newFields[field];
                }
            }
        }
    };

    getItems() {
        return this.objects;
    }

    validate (): Boolean {
        return true;
    }
}

class SorterItem {
    name = {};
    group = { name: {}, color: "", img: "" };
    img: string = "";
}

exports.Sorter = Sorter;
exports.SorterItem = SorterItem;