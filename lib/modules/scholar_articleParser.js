/* Import modules */
const read = require('node-read');

/* Import Scholar modules */
const ScholarArticle = require('./scholar_article');
const ScholarConf = require('./scholar_conf');
const ScholarSoup = require('./scholar_soup');

/** 
 * ScholarArticleParer - class
 *  This module can parse HTML document strings obtained from Google Scholar.
 *  This is a base class; concrete implementations adapting to tweaks made by Google over time follow below.
 */
class ScholarArticleParser {
    // Creates an instance of ScholarArticleParser
    constructor(site = undefined) {
        this.url = undefined;
        this.soup = undefined;
        this.article = undefined;
        this.site = site || ScholarConf.SCHOLAR_SITE;
        this.year = new RegExp('\b(?:20|19)\d{2}\b');
    }

    /** 
     * handle_article - function
     *  The parser invokes this callback on each article parsed successfully. 
     *  In this base class, the callback does nothing.
     * @param {*} article
     */
    handle_article(article) {}

    /**
     * handle_numResults - function
     *  The parser invokes this callback if it determines the overall number of results, 
     *  as reported on the parsed results page. In this base class, the callback does nothing.
     * @param {*} numResults
     */
    handle_numResults(numResults) {}

    /**
     * parse - function
     *  This method initiates parsing of HTML content, cleans resulting content as needed, 
     *  and notifies the parse instance of resulting instances via the handle_article callback.
     * @param {*} html 
     */
    parse(url) {
        var self = this;

        read(url, function(err, article, res) {
            self.soup = ScholarSoup.make_soup(article.html);

            console.log(self.soup);

            // This parses any global, non-itemized attributes from the pages/
            self._parse_globals();

            // Parse out listed articles
            //console.log(self.soup.findAll(self._tag_resultsChecker))
            /*for (let div in self.soup.findAll('div', { class: 'gs_r' })) {
                console.log(div);
                self._parse_article(div);
                self._clean_article();
                if (self.article['title']) {
                    self.handle_article(self.article);
                }
            }*/

            let test = self.soup.findAll('div', 'gs_r')
            console.log(test.contents);

            self._parse_article(self.soup.findAll('div', 'gs_r'));
            self._clean_article();
            if (self.article['title']) {
                self.handle_article(self.article);
            }
        });
    }

    /**
     * _clean_article - function
     *  This gets invoked after we have parsed an article,
     *  to do any needed cleanup/polishing before we hand off the resulting article.
     */
    _clean_article() {
        if (this.article['title']) {
            this.article['title'] = this.article['title'].strip();
        }
    }

    /**
     * _parse_globals - function
     */
    _parse_globals() {
        let tag = this.soup.find('div', {
            id: 'gs_ab_md'
        });

        if (tag !== undefined) {
            let raw_text = tag.findAll(undefined, undefined, true);

            // Raw text is a list because the body contains <b> etc
            if (raw_text !== undefined && raw_text.length > 0) {
                try {
                    let numResults = raw_text[0].split()[1];
                    numResults = numResults.split(',', '')
                    numResults = int(numResults);
                    this.handle_numResults(numResults);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        return {};
                    } else if (e instanceof RangeError) {
                        return {};
                    }
                }
            }
        }
    }

    /**
     * _parse_article - function
     * @param {*} div 
     */
    _parse_article(div) {
        this.article = new ScholarArticle();

        for (let tag in div) {
            if (tag.attrs['name'] === undefined) {
                continue;
            }

            if (tag.attrs['name'] == 'div' && this._tag_hasClass(tag, 'gs_rt') && tag.attrs['h3'] && tag.attrs['h3', 'a']) {
                this.article['title'] = tag.attrs['h3', 'a'].findAll(string = true).join('');
                this.article['url'] = this._path2url(tag.attrs['h3', 'a', 'href'])
                if (this.article['url'].endWith('.pdf')) {
                    this.article['url_pdf'] = this.article['url'];
                }
            }

            if (tag.attrs['name'] === 'font') {
                for (let tag2 in tag) {
                    if (tag2.attrs['name'] === undefined) {
                        continue;
                    }
                    if (tag2.attrs['name'] === 'span' && this._tag_hasClass(tag2, 'gs_f1')) {
                        this._parse_links(tag2);
                    }
                }
            }
        }
    }

    /**
     * _parse_links - function
     * @param {*} span 
     */
    _parse_links(span) {
        for (let tag in span) {
            if (tag.attrs['name'] === undefined) {
                continue;
            }

            if (tag.attrs['name'] !== 'a' || tag.attrs['href'] == undefined) {
                continue;
            }

            if (tag.attrs['href'].startsWith('/scholar?cites')) {
                if (tag.attrs['string'] !== undefined && tag.attrs['string'].startsWith('Cited by')) {
                    this.article['num_citations'] = this._as_integer(tag.attrs['string'].split()[-1]);
                }

                // Weird Google Scholar behavior
                this.article['url_citations'] = this._strip_urlArg('num', this._path2url(tag.attrs['href']));

                // Extract the cluster ID from the versions URL.
                let args = this.article['url_citations'].split('?', 1)[1]
                for (let arg in args.split('&')) {
                    if (arg.startsWith('cites=')) {
                        for (let i = 6; i < arg.length; ++i) {
                            this.article['cluster_id'].push(arg[i]);
                        }
                    }
                }
            }

            if (tag.attrs['href'].startsWith('/scholar?cluster')) {
                if (tag.attrs['string'] !== undefined && tag.attrs['string'].startsWith('All ')) {
                    this.article['num_versions'] = this._as_integer(tag['string'].split()[1]);
                }
                this.article['url_versions'] = this._strip_urlArg('num', this._path2url(tag['href']));
            }

            // getText
        }
    }

    /**
     * _tag_hasClass - static function
     * @param {*} tag 
     * @param {*} klass 
     */
    static _tag_hasClass(tag, klass) {
        let result = tag.attrs['class'] || [];
        if (typeof(result) != object) {
            result = result.split();
        }

        for (let key in result) {
            if (result[key] === klass) {
                return true;
            }
        }

        return false;
    }

    /**
     * _tag_resultsChecker - static function
     * @param {*} tag 
     */
    static _tag_resultsChecker(tag) {
        if (tag.attrs['name'] === 'div' && this._tag_hasClass(tag, 'gs_r')) {
            return true;
        }
    }

    /**
     * _as_integer - static function
     * @param {*} obj
     */
    static _as_integer(obj) {
        try {
            return int(obj);
        } catch (SyntaxError) {
            return undefined;
        }
    }

    /**
     * _path2url - function
     *  Helper, returns full URL in case path isn't one.
     * @param {*} path 
     */
    _path2url(path) {
        if (path.startsWith('http://')) {
            return path
        }

        if (!(path.startsWith('/'))) {
            path = '/' + path;
        }

        return this.site + path;
    }

    /**
     * _strip_urlArg - function
     *  Helper, removes a URL-encoded argument, if present.
     * @param {*} url 
     * @param {*} arg 
     */
    _strip_urlArg(url, arg) {
        let parts = url.split('?', 1);
        if (length(parts) != 2) {
            return url;
        }

        let result = [];
        for (part in parts[1].split('&')) {
            if (!(part.startsWith(arg + '='))) {
                result.push(part);
            }
        }

        return parts[0] + '?' + result.join('&');
    }
}

module.exports = ScholarArticleParser;