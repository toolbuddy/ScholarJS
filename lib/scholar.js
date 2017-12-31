/* Import Scholar modules */
const ScholarConf = require('./modules/scholar_conf');
const ScholarQuerier = require('./modules/scholar_querier');
const ScholarQuery = require('./modules/scholar_query');
const ScholarQueryCluster = require('./modules/scholar_queryCluster');
const ScholarQuerySearch = require('./modules/scholar_querySearch');
const ScholarSettings = require('./modules/scholar_settings');
const ScholarUtils = require('./modules/scholar_utils');

/* Create module */
const Scholar = {};

Scholar.engine = function(options) {
    var conf = new ScholarConf();
    var utils = new ScholarUtils();

    if (process.argv.length == 1) {
        options.help;
        return 1;
    }

    if (options.debug > 0) {
        options.debug = Math.min(options.debug, utils.LOG_LEVELS['debug']);
        conf.LOG_LEVEL = options.debug;
        utils.log('info', 'using log level ' + conf.LOG_LEVEL);
    }

    if (options.version) {
        console.log('This is ScholarJS ' + conf.VERSION + '.');
        //return 1;
    }

    //if (options.cookies) {
    //    conf.COOKIES = options.cookies;
    //}

    // Sanity-check the options: if they include a cluster ID query, it makes no sense to have search arguments
    if (options.clusterId !== undefined) {
        if (options.author ||
            options.all ||
            options.some ||
            options.none ||
            options.phrase ||
            options.titleOnly ||
            options.public ||
            options.after ||
            options.before) {
            console.log('Cluster ID queries do not allow additional search arguments.');
            return 1;
        }
    }

    var querier = new ScholarQuerier();
    var settings = new ScholarSettings();

    if (options.citations == 'bt') {
        settings.set_citeFormat(settings.CITATION_BIBTEX);
    } else if (options.citations == 'en') {
        settings.set_citeFormat(settings.CITATION_ENDNOTE);
    } else if (options.citations == 'rm') {
        settings.set_citeFormat(settings.CITATION_REFMAN);
    } else if (options.citations == 'rw') {
        settings.set_citeFormat(settings.CITATION_REFWORKS);
    } else if (options.citations != undefined) {
        console.log('Invalid citation link format, must be one of "bt", "en", "rm", or "rw".');
        return 1;
    }

    querier.apply_settings(settings);

    var query;
    if (options.clusterId) {
        query = new ScholarQueryCluster(options.clusterId);
    } else {
        query = new ScholarQuerySearch();
        console.log()
        if (options.author) {
            query.set_author(options.author);
        }
        if (options.all) {
            query.set_words(options.all);
        }
        if (options.some) {
            query.set_wordsSome(options.some);
        }
        if (options.none) {
            query.set_wordsNone(options.none);
        }
        if (options.phrase) {
            query.set_phrase(options.phrase);
        }
        if (options.titleOnly) {
            query.set_titleOnly(true);
        }
        if (options.public) {
            query.set_publication(options.pub);
        }
        if (options.after || options.before) {
            query.set_timeframe(options.after, options.before);
        }
        if (options.noCitation) {
            query.set_includeCitations(false);
        }
        if (options.noPatents) {
            query.set_includePatents(false);
        }
    }

    if (options.count !== undefined) {
        options.count = Math.min(
            options.count,
            conf.MAX_PAGE_RESULTS
        );
        query.set_numPageResults(options.count);
    }

    querier.send_query(query);

    if (options.csv) {
        Scholar.csv(querier);
    } else if (options.csvHeader) {
        Scholar.csv(querier, true);
    } else if (options.citations != undefined) {
        Scholar.citations(querier);
    } else {
        Scholar.txt(querier, options.txtGlobal);
    }

    /*if (options.cookies) {
        querier.save_cookies();
    }*/

    return 0;
}

Scholar.txt = function(querier, withGlobals) {
    if (withGlobals) {
        // If we have any articles, check their attribute labels to get the maximum length
        // Make for nicer alignment
        let max_labelLength = 0;
        if (querier.articles.length > 0) {
            let items = [];
            for (let key in querier.articles[0].attr) {
                if (querier.articles[0].attr.hasOwnProperty(key)) {
                    items.push(querier.articles[0].attr[key]);
                }
            }

            items.sort(function(a, b) {
                return a[2] - b[2];
            });

            max_labelLength = Math.max(...[items[1].length]);
        }

        // Get items sorted in specified order
        let items = [];
        for (let key in querier.query.attr) {
            if (querier.query.attr.hasOwnProperty(key)) {
                items.push(querier.query.attr[key]);
            }
        }

        items.sort(function(a, b) {
            return a[2] - b[2];
        })

        // Find largest label length
        max_labelLength = Math.max(...(items[1].length + max_labelLength));
        let format = String.format('$$$00 $$1', max_labelLength);
        for (let item in items) {
            if (item[0] != undefined) {
                console.log(String.format(format, item[0], item[1]));
            }
        }

        if (items.length > 0) {
            console.log();
        }
    }

    let articles = querier.articles;
    for (let article in articles) {
        console.log(encodeURIComponent(article.export_txt()) + '\n');
    }
}

Scholar.csv = function(querier, header = false, sep = '|') {
    let articles = querier.articles;
    for (let article in articles) {
        let result = article.export_csv(header, sep);
        console.log(encodeURIComponent(result));
        header = false;
    }
}

Scholar.citations = function(querier) {
    let articles = querier.articles;
    for (let article in articles) {
        console.log(article.export_citation + '\n');
    }
}

module.exports = Scholar;