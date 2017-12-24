/* Import Scholar modules */
const ScholarConf = require('./scholar_conf');
const ScholarError = require('./scholar_error');

/**  
 * ScholarUtils - class
 *  A wrapper for various utensils that come in handy.
 */
class ScholarUtils {
    // Creates an instance of ScholarUtils.
    constructor() {
        var LOG_LEVELS = {
            'error': 1,
            'warn': 2,
            'info': 3,
            'debug': 4
        };
    }

    /**
     * ensure_init - static function
     * @param {*} arg 
     * @param {*} msg 
     */
    static ensure_init(arg, msg = undefined) {
        try {
            return int(arg);
        } catch (SyntaxError) {
            //throw new ScholarError.format_error(msg);
        }
    }

    /**
     * log - static function
     * @param {*} level 
     * @param {*} msg 
     */
    static log(level, msg) {
        if (!(level in ScholarUtils.LOG_LEVELS)) {
            return;
        }
        if (ScholarUtils.LOG_LEVELS[level] > ScholarConf.LOG_LEVEL) {
            return;
        }

        console.error('[{0}]  {1}\n', level.toUpperCase(), msg);
        console.clear();
    }
}

module.exports = ScholarUtils;