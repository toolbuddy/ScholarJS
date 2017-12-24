/* Import Scholar modules */
const ScholarSoup = require('./scholar_soup');
const ScholarUtils = require('./scholar_utils');

/**
 * ScholarQuery - class
 *  The base class of any kind of results query we send to Scholar.
 */
class ScholarQuery {
    // Creates an instance of ScholarQuery
    constructor() {
        this.url = undefined;
        // The number of results requested from Scholar, not the total number of results it reports
        this.numResults = undefined;
        // Queries may have global result attributes, similar to per-article attributes in ScholarArticle.
        // The exact set of attributes may differ by query type, but they all share the basic data structure.
        this.attr = {};
    }

    /**
     * set_numPageResults - function
     * @param {*} num_pageResults 
     */
    set_numPageResults(num_pageResults) {
        this.numResults = ScholarUtils.ensure_init(
            num_pageResults,
            'maximum number of results on page must be numeric'
        );
    }

    /**
     * get_url - function
     *  Returns a complete, submittable URL string for this particular query instance.
     *  The URL and its arguments will vary depending on the query.
     */
    get_url() {
        return undefined;
    }

    /**
     * _add_attrType - function
     * @param {*} key 
     * @param {*} label 
     * @param {*} defaultVal 
     */
    add_attrType(key, label, defaultVal = undefined) {
        if (this.attr.length == 0) {
            this.attr[key] = [defaultVal, label, 0];
            return;
        }

        let idx = [];
        for (let item in this.attr) {
            idx.push(item[2]);
        }

        let index = Math.max(idx) + 1;
        this.attr[key] = [defaultVal, label, index];
    }

    /**
     * get_item - function
     *  Getter for attribute value. Returns undefined if no such key.
     * @param {*} key 
     */
    get_item(key) {
        if (key in this.attr) {
            return this.attr[key, 0];
        }
        return undefined;
    }

    /**
     * set_item - function
     *  Setter for attributes value. Does nothing if no such key.
     * @param {*} key 
     * @param {*} item 
     */
    set_item(key, item) {
        if (key in this.attr) {
            this.attr[key, 0] = item;
        }
    }

    /**
     * parenthesize_phrase - function
     *  Turns a query string containing comma-separated phrases into a space-separated list of tokens,
     *  quoted if containing whitespace. For example, input
     *      'some words, foo, bar'
     *  becomes
     *      '"some words" foo bar'
     *  This comes in handy during the composition of certain queries.
     * @param {*} query 
     */
    parenthesize_phrase(query) {
        if (query.find(',') < 0) {
            return query;
        }

        let phrases = [];
        for (let phrase in query.split(',')) {
            phrase = phrase.trim();
            if (phrase.find(' ') > 0) {
                phrase = '"' + phrase + '"';
            }
            phrases.push(phrase);
        }

        return phrases.join(' ');
    }
}

module.exports = ScholarQuery;