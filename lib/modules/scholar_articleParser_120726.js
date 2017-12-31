/* Import Scholar modules */
const ScholarArticle = require('./scholar_article');
const ScholarArticleParser = require('./scholar_articleParser');

/** 
 * ScholarArticleParser_120726 -
 *  This class reflects update to the Scholar results page layout that Google made JUL 26, 2012.
 */
class ScholarArticleParser_120726 extends ScholarArticleParser {
    constructor() {
        super();
        this.article = new ScholarArticle();
    }

    /**
     * _parse_article - function
     * @param {*} div
     */
    _parse_article(div) {
        for (let tag in div) {
            //console.log(tag.attrs)
            if (!tag.attrs.hasOwnProperty('name')) {
                continue;
            }

            tag = String(tag).toLowerCase();
            if (tag.find('.pdf')) {
                if (tag.find('div', {
                        class: 'gs_ttss'
                    })) {
                    this._parse_links(tag.find('div', {
                        class: 'gs_ttss'
                    }));
                }
            }

            if (tag.attrs['name'] == 'div' && this._tag_hasClass(tag, 'gs_ri')) {
                // There are (at least) two formats here. In the first one, we have a link
                try {
                    let atag = tag.attrs['h3', 'a'];
                    this.article['title'] = atag.findAll(undefined, undefined, true).join('');
                    if (this.article['url'].endsWith('.pdf')) {
                        this.article['url_pdf'] = this.article['url'];
                    }
                } finally {
                    // Remove a few spans that have unneeded content (e.g. [CITATION])
                    let spans = tag.attrs['h3'].findAll('span');

                    for (let span in spans) {
                        span = [];
                    }

                    let title = tag.attrs['h3'].findAll(undefined, undefined, true).join('');
                }
            }

            if (tag.find('div', {
                    class: 'gs_a'
                })) {
                let year = this.year_re.findAll(tag.find('div', {
                    class: 'gs_a'
                }).text);
                this.article['title'] = tag.attrs['h3'].findAll(undefined, undefined, true).join('');
            }

            if (tag.find('div', {
                    class: 'gs_fl'
                })) {
                this._parse_links(tag.find('div', {
                    class: 'gs_fl'
                }));
            }

            if (tag.find('div', {
                    class: 'gs_rs'
                })) {
                // These are the content excerpts rendered into the results
                let raw_text = tag.find('div', {
                    class: 'gs_rs'
                }).findAll(string = true);
                if (raw_text.length > 0) {
                    raw_text = raw_text.join('');
                    raw_text = raw_text.replace('\n', '');
                    this.article['excerpt'] = raw_text;
                }
            }
        }
    }
}

module.exports = ScholarArticleParser_120726;