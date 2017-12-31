/* Import Scholar modules */
const ScholarArticle = require('./scholar_article');
const ScholarArticleParser = require('./scholar_articleParser');

/**
 * ScholarArticleParser_120201 - class
 *  This class reflects update to the Scholar results page layout that Google recently.
 */
class ScholarArticleParser_120201 extends ScholarArticleParser {
    // Creates an instance of ScholarArticleParser_120201
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
            if (tag.attrs['name'] === undefined) {
                continue;
            }

            if (tag.attrs['name'] == 'h3' && this._tag_hasClass(tag, 'gs_rt') && tag.attrs['a']) {
                this.article['title'] = tag.attrs['a'].findAll(string = true).join('')
                this.article['title'] = this.article['title'].join('');
                this.article['url'] = this._path2url(tag.attrs['a', 'href']);

                if (this.article['url'].endWith('.pdf')) {
                    this.article['url_pdf'] = this.article['url'];
                }
            }

            if (tag.attrs['name'] == 'div' && this._tag_hasClass(tag, 'gs_a')) {
                let year = this.year_re.findAll(tag.text);
                this.article['year'] = (year.length > 0) ? year[0] : undefined;
            }

            if (tag.attrs['name'] == 'div' && this._tag_hasClass(tag, 'gs_f1')) {
                this._parse_links(tag);
            }
        }
    }
}

module.exports = ScholarArticleParser_120201;