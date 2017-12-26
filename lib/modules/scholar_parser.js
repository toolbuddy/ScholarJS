/* Import Scholar modules */
const ScholarArticleParser = require('./scholar_articleParser_120726');

/**
 * ScholarParser - class
 */
class ScholarParser extends ScholarArticleParser {
    // Creates an instance of ScholarParser
    constructor(querier) {
        super();
        this.articleParser = new ScholarArticleParser();
        this.querier = querier;
    }

    /**
     * handle_numResults - function
     * @param {any} num_results 
     */
    handle_numResults(num_results) {
        if (this.querier != undefined && this.querier.query != undefined) {
            this.querier.query['num_results'] = num_results;
        }
    }

    /**
     * handle_article - function
     * @param {any} article 
     */
    handle_article(article) {
        this.querier.add_article(article);
    }
}

module.exports = ScholarParser;