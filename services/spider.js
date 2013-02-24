/**
 *  Spider, parse site: ras.aribitr.ru 
 *          selects all court decisions and saves them to the database in a normalized form
 * 
 *  Run as serveice, in crontab
 */

function run(date, finish) {
    console.log('Spider start at' + date);
    
    finish(Date.now());
}


exports.run = run;