/* Import module */
const soup = require('jssoup').default;

/**
 * ScholarSoup - class
 *  Factory for creating JSSoup instances
 */
class ScholarSoup {
    /**
     * make_soup - static function
     *  Factory method returning a JSSoup instance.
     *  The created instance will use a parser of the given name, 
     *  if supported by the underlying JSSoup instance.
     * @param {*} markup 
     * @param {*} parser 
     */
    static make_soup(markup, parser = undefined) {
        return soup(markup);
    }
}

module.exports = ScholarSoup;