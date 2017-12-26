/* Import modules */
const chalk = require('chalk');
const program = require('commander');

/* Scholar engine */
const Scholar = require('./lib/scholar');

/* Query arguments - These options define search query arguments and parameters. */
program
    .version('0.0.1')
    .option('-A, --all <WORDS>', 'Results must contain all of these words.')
    .option('-a, --author <AUTHOR>', 'Results must contain author names.')
    .option('-C, --clusterId <CLUSTER_ID>', 'Do not search, just use articles in given cluster ID.')
    .option('-c, --count <INT>', 'Maximum number of results.', parseInt)
    .option('-n, --none <WORDS>', 'Results must contain none of these words. See -s|--some re. formatting.')
    .option('-P, --pub <PUB>', 'Results must have appeared in this publication.')
    .option('-p, --phrase <PHRASE>', 'Results must contain exact phrase.')
    .option('-s, --some <WORDS>', 'Results must contain at least one of these words. Pass arguments in form -s "foo bar baz" for simple words, and -s "a phrase, another phrase" for phrases.')
    .option('-t, --titleOnly', 'Seach title only.')
    .option('--after <YEAR>', 'Results must have appeared in or after given year.')
    .option('--before <YEAR>', 'Results must have appeared in or before given year.')
    .option('--noCitation', 'Do not include citations in results.')
    .option('--noPatent', 'Do not include patents in results.')

/* Output format - These options control the appearance of the results. */
program
    .option('--csv', 'Print article data in CSV form (separator is "|").')
    .option('--csvHeader', 'Like --csv, but print header with column names.')
    .option('--txt', 'Print article data in text format (default).')
    .option('--txtGlobal', 'Like --txt, but first print global results too.')
    .option('--citation <FORMAT>', 'Print article details in standard citation format. Argument Must be one of "bt" (BibTeX), "en" (EndNote), "rm" (RefMan), or "rw" (RefWorks).')

/* Miscellaneous */
program
    .option('-d, --debug', 'Enable verbose logging to stderr. Repeated options increase detail of debug output')
    .option('-h, --help', 'Helper manual')
    .option('-k, --cookie', 'File to use for cookie storage. If given, will read any existing cookies if found at startup, and save resulting cookies in the end')

program.parse(process.argv);

console.log('\nWelcome using toolbuddy@ScholarJS!\n');

if (!program.help) {
    console.log(
        chalk.yellow('Query arguments - These options define search query arguments and parameters.\n'),
        chalk.red('Usage: scholar [options] <query string>\n'),
        chalk.white('A command-line interface to Google Scholar.\n'),
        chalk.blue('Examples:\n'),
        chalk.blue('# Retrieve one article written by Einstein on quantum theory:\n'),
        chalk.red('$ scholar -c 1 --author "albert einstein" --phrase "quantum theory"\n'),
        chalk.blue('# Retrieve a BibTeX entry for that quantum theory paper:\n'),
        chalk.red('$ scholar -c 1 -C 17749203648027613321 --citation bt\n'),
        chalk.blue('# Retrieve five articles written by Einstein after 1970 where the title does not contain the words "quantum" and "theory":\n'),
        chalk.red('$ scholar -c 5 -a "albert einstein" -t --none "quantum theory" --after 1970\n\n'),
        chalk.white('    -A[--all] <WORDS> : Results must contain all of these words.\n'),
        chalk.white('    -a[--author] <AUHTOR> : Results must contain author names.\n'),
        chalk.white('    -C[--clusterId] <CLUSTER_ID> : Do not search, just use articles in given cluster ID.\n'),
        chalk.white('    -c[--count] <INT> : Maximum number of results.\n'),
        chalk.white('    -n[--none] <WORDS> : Results must contain none of these words. See -s|--some re. formatting.\n'),
        chalk.white('    -P[--pub] <PUB> : Results must have appeared in this publication.\n'),
        chalk.white('    -p[--phrase] <PHRASE> : Results must contain exact phrase.\n'),
        chalk.white('    -s[--some] <WORDS> : Results must contain at least one of these words. Pass arguments in form -s "foo bar baz" for simple words, and -s "a phrase, another phrase" for phrases.\n'),
        chalk.white('    -t[--titleOnly] : Seach title only (default: false).\n'),
        chalk.white('    --after <YEAR> : Results must have appeared in or after given year.\n'),
        chalk.white('    --before <YEAR> : Results must have appeared in or before given year.\n'),
        chalk.white('    --noCitation : Do not include citations in results (default: false).\n'),
        chalk.white('    --noPatent : Do not include patents in results, (default: false).\n\n')
    );
    console.log(
        chalk.yellow('Output format - These options control the appearance of the results.\n'),
        chalk.white('     --csv : Print article data in CSV form (separator is "|").\n'),
        chalk.white('     --csvHeader : Like --csv, but print header with column names.\n'),
        chalk.white('     --txt : Print article data in text format (default).\n'),
        chalk.white('     --txtGlobal : Like --txt, but first print global results too.\n\n'),
        chalk.white('     --citations : Print article details in standard citation format. Argument Must be one of "bt" (BibTeX), "en" (EndNote), "rm" (RefMan), or "rw" (RefWorks).')
    );
    console.log(
        chalk.yellow('Miscellaneous\n'),
        chalk.white('     --d [--debug] : Print article data in CSV form (separator is "|").\n')
        //chalk.white('     --k [--cookies] : File to use for cookie storage. If given, will read any existing cookies if found at startup, and save resulting cookies in the end.\n\n')
    );

    return;
} else {
    Scholar.engine(program);
}