/* Create module */
const ScholarError = {};

/**
 * error - function
 */
ScholarError.error = function(msg) {
    console.error('Basic class for any Scholar error.\n');
    //return new Error('Basic class for any Scholar error.\n');
    //return 'error';
}

/**
 * format_error - function
 */
ScholarError.format_error = function(msg) {
    this.msg = msg;
    //console.error('A query argument or setting was formatted incorrectly.\n');
    //return new Error('A query argument or setting was formatted incorrectly.\n');
    return 'format_error';
}

/**
 * queryArgument_error - function
 */
ScholarError.queryArgument_error = function(msg) {
    console.error('A query did not have a suitable set of arguments.\n');
    //return new Error('A query did not have a suitable set of arguments.\n');
    //return 'queryArgumentError';
}

module.exports = ScholarError;