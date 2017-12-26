/* Import Scholar modules */
const ScholarConf = require('./scholar_conf');
const ScholarError = require('./scholar_error');
const ScholarQuery = require('./scholar_query');
const ScholarUtils = require('./scholar_utils');

/**
 * ScholarQueryCluster - class
 *  This version just pulls up an article cluster whose ID we already know about.
 */
class ScholarQueryCluster extends ScholarQuery {
    // Creates an instance of ScholarQueryCluster
    constructor(cluster = undefined) {
        super();
        this.query = new ScholarQuery();
        this.urlArgs = {
            'cluster': '',
            'num': ''
        };
        this.SCHOLAR_CLUSTER_URL = ScholarConf.SCHOLAR_SITE +
            '/scholar?cluster=' + this.urlArgs['cluster'] +
            '%(num)s' + this.urlArgs['num'];
        this.add_attrType('num_results', 'Results', 0);
        this.cluster = undefined;
        this.set_cluster(cluster);
    }

    /**
     * set_cluster - function
     *  Sets search to a Google Scholar results cluster ID
     * @param {*} cluster 
     */
    set_cluster(cluster) {
        let msg = 'cluster ID must be numeric';
        this.cluster = ScholarUtils.ensure_init(cluster, msg);
    }

    /**
     * get_url - function
     */
    get_url() {
        if (this.cluster == undefined) {
            throw ScholarError.queryArgument_error();
        }

        this.urlArgs['cluster'] = this.cluster;

        Object.keys(urlArgs).forEach(function(key) {
            urlArgs[key] = encodeURIComponent(urlArgs[key]);
        });

        // The following URL arguments must not be quoted, or the server will not recognize them.
        if (this.num_results != undefined) {
            urlArgs['num'] = '&num=' + this.num_results;
        } else {
            urlArgs['num'] = undefined;
        }

        return this.SCHOLAR_CLUSTER_URL + urlArgs; // fix
    }
}

module.exports = ScholarQueryCluster;