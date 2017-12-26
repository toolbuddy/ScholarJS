/* Import Scholar modules */
const ScholarConf = require('./scholar_conf');
const ScholarError = require('./scholar_error');

/**  
 * ScholarUtils - class
 *  A wrapper for various utensils that come in handy.
 */
class ScholarUtils {
    // Creates an instance of ScholarUtils.
    constructor() {}

    /**
     * ensure_init - static function
     * @param {*} arg 
     * @param {*} msg 
     */
    static ensure_init(arg, msg = undefined) {
        try {
            throw int(arg);
        } catch (SyntaxError) {
            return ScholarError.format_error(msg);
        }
    }

    /**
     * log - static function
     * @param {*} level 
     * @param {*} msg 
     */
    static log(level, msg) {
        let LOG_LEVELS = {
            'error': 1,
            'warn': 2,
            'info': 3,
            'debug': 4
        };

        for (let key in LOG_LEVELS) {
            if (level == key) {
                break;
            } else {
                continue;
            }
            return;
        }

        if (LOG_LEVELS[level] > ScholarConf.LOG_LEVEL) {
            return;
        }

        console.error('[%s]  %s\n', level.toUpperCase(), msg);
        //console.clear();
    }
}

module.exports = ScholarUtils;