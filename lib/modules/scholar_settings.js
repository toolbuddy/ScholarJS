/* Import Scholar modules */
const ScholarError = require('./scholar_error');
const ScholarUtils = require('./scholar_utils');

/**
 * ScholarSettings - class
 *  This class lets you adjist the Scholar settings for your session.
 *  It's intended to mirror the features tunable in the Scholar Settings pane, 
 *  but right now it's a bit basic.
 */
class ScholarSettings {
    // Creates an instance of ScholarSettings
    constructor() {
        this.CITATION_NONE = 0;
        this.CITATION_REFWORKS = 1;
        this.CITATION_REFMAN = 2;
        this.CITATION_ENDNOTE = 3;
        this.CITATION_BIBTEX = 4;
        // Citation format (default: 0)
        this.citeFormat = 0;
        this.perPageResults = undefined;
        this.isConfigured = false;
    }

    /**
     * set_citeFormat - function
     * @param {*} citeFormat 
     */
    set_citeFormat(citeForm) {
        citeForm = ScholarUtils.ensure_init(citeForm);
        if (citeForm < 0 || citeForm > this.CITATION_BIBTEX) {
            return ScholarError.format_error();
        }

        this.citeFormat = citeForm;
        this.isConfigured = true;
    }

    /**
     * set_perPageResults - function
     * @param {*} perPageResults 
     */
    set_perPageResults(perPageResults) {
        this.perPageResults = ScholarUtils.ensure_init(
            perPageResults,
            'page results must be integer'
        );

        this.perPageResults = min(
            this.perPageResults,
            ScholarConf.MAX_PAGE_RESULTS
        );

        this.isConfigured = true;
    }

    /**
     * get_isConfigured - function
     */
    get_isConfigured() {
        return this.isConfigured;
    }
}

module.exports = ScholarSettings;