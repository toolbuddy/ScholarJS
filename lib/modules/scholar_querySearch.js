/* Import Scholar modules */
const ScholarConf = require('./scholar_conf');
const ScholarError = require('./scholar_error');
const ScholarQuery = require('./scholar_query');
const ScholarUtils = require('./scholar_utils');

/**
 * ScholarQuerySearch - class
 *  This version represents the search query parameters the user can configure on the Scholar website,
 *  in the advanced search options.
 */
class ScholarQuerySearch extends ScholarQuery {
    constructor() {
        super();
        this.conf = new ScholarConf();
        this.query = new ScholarQuery();
        this.urlArgs = {
            'words': '',
            'phrase': '',
            'wordsSome': '',
            'wordsNone': '',
            'scope': '',
            'author': '',
            'publication': '',
            'ylo': '',
            'yhi': '',
            'citations': '',
            'num': '',
            'patents': ''
        };
        this.SCHOLAR_QUERY_URL = this.conf.SCHOLAR_SITE +
            '/scholar?as_q=' + this.urlArgs['words'] +
            '&as_epq=' + this.urlArgs['phrase'] +
            '&as_oq=' + this.urlArgs['wordsSome'] +
            '&as_eq=' + this.urlArgs['wordsNone'] +
            '&as_occt=' + this.urlArgs['titleOnly'] +
            '&as_sauthors=' + this.urlArgs['author'] +
            '&as_publication=' + this.urlArgs['publication'] +
            '&as_ylo=' + this.urlArgs['ylo'] +
            '&as_yhi=' + this.urlArgs['yhi'] +
            '&as_vis=' + this.urlArgs['citations'] +
            '&btnG=&hl=en' + this.urlArgs['num'] +
            '&as_sdt=' + this.urlArgs['patents'] +
            '%%2C5';

        this.query.add_attrType('num_results', 'Results', 0);

        this.words = undefined;
        this.wordsSome = undefined;
        this.wordsNone = undefined;
        this.phrase = undefined;
        this.titleOnly = false;
        this.author = undefined;
        this.publication = undefined;
        this.timeframe = [undefined, undefined];
        this.includePatents = true;
        this.includeCitations = true;
    }

    /**
     * set_words - function
     *  Sets words that 'all' must be found in the result
     * @param {*} words 
     */
    set_words(words) {
        this.words = words;
    }

    /**
     * set_wordsSome - function
     *  Setes words which 'at least one' must be found in result
     * @param {*} words 
     */
    set_wordsSome(words) {
        this.wordsSome = words;
    }

    /**
     * set_wordsNone - function
     *  Sets words which 'none' must be found in the result
     * @param {*} words 
     */
    set_wordsNone(words) {
        this.wordsNone = words;
    }

    /**
     * set_phrase - function
     *  Sets phrase that must be found in the result exactly
     * @param {*} phrase 
     */
    set_phrase(phrase) {
        this.phrase = phrase;
    }

    /**
     * set_titleOnly - function
     *  Sets boolean indicating whether to search entire article or title only
     * @param {*} titleOnly 
     */
    set_titleOnly(titleOnly) {
        this.titleOnly = titleOnly;
    }

    /**
     * set_author - function
     *  Sets names that must be on the result's author list
     * @param {*} author 
     */
    set_author(author) {
        this.author = author;
    }

    /**
     * set_public - function
     *  Sets the publication in which the result must be found
     * @param {*} publication 
     */
    set_public(publication) {
        this.publication = publication;
    }

    /**
     * set_timeframe - function
     *  Sets timeframe (in years as integer) in which result must have appeared.
     *  It's fine to specify just start or end, or both.
     * @param {*} start 
     * @param {*} end 
     */
    set_timeframe(start = undefined, end = undefined) {
        if (start) {
            start = ScholarUtils.ensure_init(start);
        }
        if (end) {
            end = ScholarUtils.ensure_init(end);
        }

        this.timefram = [start, end];
    }

    /**
     * set_includePatents - function
     * @param {*} flag 
     */
    set_includePatents(flag) {
        this.includePatents = flag;
    }

    /**
     * set_includeCitations - function
     * @param {*} flag 
     */
    set_includeCitations(flag) {
        this.includeCitations = flag;
    }

    /**
     * get_url - function
     */
    get_url() {
        if (this.words === undefined &&
            this.wordsSome === undefined &&
            this.wordsNone === undefined &&
            this.phrase === undefined &&
            this.author === undefined &&
            this.publication === undefined &&
            this.timeframe[0] === undefined &&
            this.timeframe[1] === undefined) {
            throw ScholarError.queryArgument_error();
        }

        // If we have some-words or none-words lists, we need to process them so GS understands them
        // For simple space-separated word lists, there's nothing to do
        // For lists of phrases we have to ensure quotations around the phrases, separating them by whitespace
        this.wordsSome = undefined;
        this.wordsNone = undefined;

        if (this.wordsSome) {
            this.wordsSome = this.parenthesize_phrases(this.wordsSome);
        }
        if (this.wordsNone) {
            this.wordsNone = this.parenthesize_phrases(this.wordsNone);
        }

        this.urlArgs = {
            'words': this.words || '',
            'phrase': this.phrase || '',
            'wordsSome': this.wordsSome || '',
            'wordsNone': this.wordsNone || '',
            'scope': (this.titleOnly) ? 'title' : 'any',
            'author': this.author || '',
            'publication': this.publication || '',
            'ylo': this.timeframe[0] || '',
            'yhi': this.timeframe[1] || '',
            'citations': (this.includeCitations) ? '0' : '1',
            'num': '',
            'patents': (this.includePatents) ? '0' : '1'
        };

        for (let key in this.urlArgs) {
            this.urlArgs[key] = encodeURIComponent(this.urlArgs[key]);
        }

        // The following URL arguments must not quoted, or the server will not recognize them
        if (this.num_results !== undefined) {
            this.urlArgs['num'] = '&num=' + this.num_results;
        } else {
            this.urlArgs['num'] = '';
        }

        this.SCHOLAR_QUERY_URL = this.conf.SCHOLAR_SITE +
            '/scholar?as_q=' + this.urlArgs['words'] +
            '&as_epq=' + this.urlArgs['phrase'] +
            '&as_oq=' + this.urlArgs['wordsSome'] +
            '&as_eq=' + this.urlArgs['wordsNone'] +
            '&as_occt=' + this.urlArgs['titleOnly'] +
            '&as_sauthors=' + this.urlArgs['author'] +
            '&as_publication=' + this.urlArgs['publication'] +
            '&as_ylo=' + this.urlArgs['ylo'] +
            '&as_yhi=' + this.urlArgs['yhi'] +
            '&as_vis=' + this.urlArgs['citations'] +
            '&btnG=&hl=en' + this.urlArgs['num'] +
            '&as_sdt=' + this.urlArgs['patents'] +
            '%%2C5';

        return this.SCHOLAR_QUERY_URL;
    }
}

module.exports = ScholarQuerySearch;