/**  
 * ScholarConf - class
 * Helper class for global settings.
 */
class ScholarConf {
    // Creates an instance of ScholarConf
    constructor() {
        // Define global settings
        this.VERSION = '1.0.0';
        this.LOG_LEVEL = 1;
        this.SCHOLAR_SITE = 'http://scholar.google.com';
        this.USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64; rv:27.0) Gecko/20100101 Firefox/27.0';

        // Define current default for per-page results
        this.MAX_PAGE_RESULTS = 10;

        // Define cookies across sessions
        //this.COOKIES = undefined;
    }
}

module.exports = ScholarConf;