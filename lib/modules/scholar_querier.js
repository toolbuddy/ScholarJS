/* Import Scholar modules */
const ScholarConf = require('./scholar_conf');
const ScholarParser = require('./scholar_parser');
const ScholarUtils = require('./scholar_utils');

/**
 * ScholarQuerier - class
 *  This instances can conduct a search on Google Scholar with subsequent parsing of the resulting HTML content.
 *  The articles found are collected in the articles member, a list of ScholarArticle instances.
 */
class ScholarQuerier {
    constructor() {
        this.conf = new ScholarConf();

        // Default URLs for visiting and submitting settings pane, as of 3/14
        this.GET_SETTINGS_URL = this.conf.SCHOLAR_SITE + '/scholar_settings?sciifh=1&hl=en&as_sdt=0,5';

        // Sets URL
        this.urlArgs = {
            'scisig': '',
            'num': '',
            'scis': '',
            'scisf': ''
        };
        this.SET_SETTINGS_URL = this.conf.SCHOLAR_SITE + '/scholar_setprefs?' +
            'q=' +
            '&scisig=' + this.urlArgs['scisig'] +
            '&inststart=0' +
            '&as_sdt=1,5' +
            '&as_sdtp=' +
            '&num=' + this.urlArgs['num'] +
            '&scis=' + this.urlArgs['scis'] + this.urlArgs['scisf'] +
            '&hl=en&lang=all&instq=&inst=569367360547434339&save=';

        this.articles = [];
        this.query = undefined;
        this.markup = undefined;
        // Last settings object, if any.
        this.settings = undefined;
    }

    /**
     * apply_settings - function
     *  Applies settings as provided by a ScholarSettings instance.
     * @param {*} settings 
     */
    apply_settings(settings) {
        if (settings === undefined || !settings.get_isConfigured()) {
            return true;
        }

        this.settings = settings;

        // This is a bit of work. 
        // We need to actually retrieve the contents of the settings pane HTML in order to extract hidden fields before we can compose the query for updating the settings.
        let html = this.get_HTTPresponse(
            this.GET_SETTINGS_URL,
            'dump of settings form HTML',
            'requesting settings failed'
        );

        if (html === undefined) {
            return false;
        }

        // Now parse the required stuff out of the form.
        // We require the "scisig" token to make the upload of our settings acceptable to Google.
        let tag = html.find(
            name = 'form',
            attrs = {
                'id': 'gs_settings_form'
            });
        if (tag === undefined) {
            ScholarUtils.log('info', 'parsing settings failed: no form');
            return false;
        }

        tag = tag.find(
            name = 'input',
            attrs = {
                'type': 'hidden',
                'name': 'scisig'
            });
        if (tag === undefined) {
            ScholarUtils.log('info', 'parsing settings failed: scisig');
            return false;
        }

        this.urlArgs = {
            'scisig': tag['value'],
            'num': settings.perPageResults,
            'scis': 'no',
            'scisf': ''
        };

        if (settings.citeForm != 0) {
            this.urlArgs['scis'] = 'yes';
            this.urlArgs['scisf'] = '&scisf=' + settings.citeForm;
        }

        html = this.get_HTTPresponse(
            this.SET_SETTINGS_URL,
            'dump of settings result HTML',
            'applying settings failed'
        );

        if (html === undefined) {
            return false;
        }

        ScholarUtils.log('info', 'settings applied');

        return true;
    }

    /**
     * send_query - function
     *  This method initiates a search query (a ScholarQuery instance) with subsequent parsing of the response.
     * @param {*} query 
     */
    send_query(query) {
        this.clear_article();
        this.query = query;

        let html = this.get_HTTPresponse(
            this.query.get_url(),
            'dump of query response HTML',
            'results retrieval failed'
        );

        if (html === undefined) {
            return;
        }

        this.parse(html);
    }

    /**
     * get_citation - function
     *  Given an article, retrieve citation link. 
     *  Note, this requires that you adjustd the settings to tell Google Scholar to actually provide this information, 
     *  'prior' to retrieving the article. 
     * @param {*} article 
     */
    get_citation(article) {
        if (article['url_citation'] === undefined) {
            return false;
        }
        if (article['citation'] !== undefined) {
            return true;
        }

        ScholarUtils.log('info', 'retrieving citation export data');
        let data = this.get_HTTPresponse(
            url = article['url_citation'],
            logMsg = 'citation data response',
            errMsg = 'requesting citation data failed'
        )

        if (data == undefined) {
            return false;
        }

        article.set_citation(data);
        return true;
    }

    /**
     * parse - function
     *  This method allows parsing of provided HTML content
     * @param {*} html 
     */
    parse(html) {
        let parser = new ScholarParser();
        parser.parse(html);
    }

    /**
     * add_article - function
     * @param {*} article 
     */
    add_article(article) {
        this.get_citation(article);
        this.article.push(article);
    }

    /**
     * clear_article - function
     *  Clears any existing articles stored from previous queries
     */
    clear_article() {
        this.article = [];
    }

    /**
     * save_cookies - function
     *  This stores the latest we're using to disk, for reuse in a later session
     */
    /*
    save_cookies() {
        if (this.conf.COOKIES == undefined) {
            return false;
        }

        try {
            this.cjar.save(
                ScholarConf.COOKIES,
                ignore_discard = true
            );
            ScholarUtils.log('info', 'saved cookies file');
            return true;
        } catch (e) {
            ScholarUtils.log('warn', 'could not save cookies file: ' + e);
            return false;
        }
    }
    */

    /**
     * get_HTTPresponse - function
     *  Helper method, sends HTTP request and returns response payload
     * @param {*} url 
     * @param {*} logMsg 
     * @param {*} errMsg 
     */
    get_HTTPresponse(url, logMsg = undefined, errMsg = undefined) {
        if (logMsg === undefined) {
            logMsg = 'HTTP response data follow';
        }
        if (errMsg === undefined) {
            errMsg = 'request failed';
        }

        //try {
        ScholarUtils.log('info', 'requesting ' + url);

        return url;

        //} catch (e) {
        //    ScholarUtils.log('info', errMsg + ': ' + e);
        //}
    }
}

module.exports = ScholarQuerier;