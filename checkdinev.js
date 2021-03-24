const request = require('superagent')
const cheerio = require('cheerio')
require('dotenv').config()
const council = process.env.AREA;

var InfiniteLoop = require('infinite-loop');
var il = new InfiniteLoop;

//5 minutes
const checkTimeSeconds = 5 * 60;

function checkCycle() {
    checkHtml(council).then(result => {
        console.log(result);
    })
}

function checkHtml(council) {
    return new Promise((resolve, reject) => {
        request
        .get('https://www.service.nsw.gov.au/dine-discover-nsw-vouchers-address-check')
        .then(res => {
            const $ = cheerio.load(res.text)
            const jsonEle = $("body > script")
            Object.keys(jsonEle).forEach(function(key) {
                var val = jsonEle[key];
                if(typeof(val.attribs) != "undefined"){
                    if(typeof(val.attribs.type) != "undefined"){
                        if(val.attribs.type === "application/json"){
                            resolve("Result for council area '" + council + "' is - " + JSON.parse(val.children[0].data).snswDndCheck.lgaStates[council])
                        }
                    }
                }
            });
            resolve("Could not find council '" + council + "'");
        })
        .catch(reject)
    })
}

il.add(checkCycle).run(1).setInterval(checkTimeSeconds*1000).run();