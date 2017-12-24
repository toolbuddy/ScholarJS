/** 
 * ScholarArticle -
 * A class representing articles listed on Google Scholar.
 * The class provides basic dictionary-like behavior.
 */
class ScholarArticle {
    // Creates an instance of ScholarArticle
    constructor() {
        this.attr = {
            'title': [undefined, 'Title', 0],
            'url': [undefined, 'URL', 1],
            'year': [undefined, 'Year', 2],
            'num_citations': [0, 'Citations', 3],
            'num_versions': [0, 'Versions', 4],
            'cluster_id': [undefined, 'Cluster ID', 5],
            'url_pdf': [undefined, 'PDF link', 6],
            'url_citations': [undefined, 'Citations link', 7],
            'url_versions': [undefined, 'Versions link', 8],
            'url_citation': [undefined, 'Citation link', 9],
            'excerpt': [undefined, 'Excerpt', 10]
        };
        // The citation data in one of the standard export formats, e.g. BibTeX
        this.citation = undefined;
    }

    /**
     * get_item - function
     * @param {*} key 
     */
    get_item(key) {
        if (key in this.attr) {
            return this.attr[key, 0];
        }
        return undefined;
    }

    /**
     * get_attrLength - function
     */
    get_attrLength() {
        return this.attr.length;
    }

    /**
     * set_item - function
     * @param {*} key 
     * @param {*} item 
     */
    set_item(key, item) {
        if (key in this.attr) {
            this.attr[key, 0] = item;
        } else {
            this.attr[key] = [
                item,
                key,
                this.attr.length
            ];
        }
    }

    /**
     * remove_item - function
     * @param {*} key 
     */
    remove_item(key) {
        if (key in this.attr) {
            delete this.attr[key];
        }
    }

    /**
     * set_citation - function
     * @param {*} citation 
     */
    set_citation(citation) {
        this.citation = citation;
    }

    /**
     * export_txt - function
     */
    export_txt() {

        // Get items sorted in specified order
        let items = [];
        for (let key in this.attr) {
            if (this.attr.hasOwnProperty(key)) {
                items.push(this.attr[key]);
            }
        }

        items.sort(function(a, b) {
            return a[2] - b[2];
        });

        // Fixed largest label length
        let max_labelLength = Math.max(...[items[1].length]);
        let format = String.format('$$$00 $$1', max_labelLength);
        let result = [];
        for (let item in items) {
            if (item[0] != undefined) {
                result.push(String.format(format, item[0], item[1]));
            }
        }
    }

    /**
     * export_csv - function
     * @param {*} header 
     * @param {*} sep 
     */
    export_csv(header = false, sep = '|') {
        // Get keys sorted in specified order
        let keys = [];
        for (let key in this.attr) {
            keys.push([key, this.attr[key, 2]]);
        }

        keys.sort(function(a, b) {
            return a[1] - b[1];
        });

        let result = [];
        if (header) {
            result.push(keys.join(sep));
        }

        result.push(function() {
            for (let key in keys) {
                return this.attr[key, 0];
            }
        });

        return result.join('\n');
    }

    /** 
     * export_citation - function
     *  Reports the article in a standard citation format.
     *  This works only if you have configured the querier to retrieve a particular citation export format. (See ScholarSetting)
     */
    export_citation() {
        return (this.citation || '');
    }
}

module.exports = ScholarArticle;