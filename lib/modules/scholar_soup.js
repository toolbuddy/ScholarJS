/* Import module */
const soup = require('jssoup').default;

/**
 * ScholarScrap - class
 */
class ScholarSoup {
    /**
     * make_soup - function
     * @param {*} markup 
     */
    static make_soup(markup) {
        return new soup(markup);
    }
}

module.exports = ScholarSoup;