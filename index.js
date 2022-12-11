/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  3.0.0                                                        *
 * Date         :  04 Sep 2022                                                  *
 * Author       :  https://github.com/PrasannaBrabourame                        *
 * Last updated :  10 Dec 2022                                                  *
 ********************************************************************************/

const puppeteer = require('puppeteer');
const fs = require('fs')
const pageRedirect = require('./pageRedirect')
const {
    autoScroll
} = require('./helper');
const fetchNumber = require('./fetchNumber')

/**
 * Init function to open the page and fetch the data from chotot.com
 * @async
 * @function getData
 */
const getData = async () => {
    let browser
    let page
    try {
        let batchIteration = [...Array(45)]
        browser = await puppeteer.launch({
            headless: true // To open the browser
        });
        page = await browser.newPage();
        await page.goto('http://chotot.com/', {
            waitUntil: 'domcontentloaded'
        });
        await page.setViewport({
            width: 1200,
            height: 800
        });
        await autoScroll(page);
        await page.waitForSelector('.async-grid')
        // This part is used to fetch the data from 1st page until 49 show more

        // for (const entry in batchIteration) {
        //     console.log(entry)
        //     await page.evaluate(() => {
        //        document.querySelector('.async-grid > div > div > button').click();
        //     });
        //     await page.waitForSelector('.async-grid > div > div > button')
        // }
        // linkResponse = await page.evaluate(() => {
        //     let elements = Array.from(document.querySelectorAll('.async-grid > div > div > div > div > div > a[class^=AdThumbnail_thumbnailImg][href]'));
        //     let links = elements.map(element => {
        //         return element.href
        //     })
        //     return links;
        // });
        let categoryLinksResponse = await page.evaluate(() => {
            let elements = Array.from(document.querySelectorAll('div[class^=WrapperScroll_wrapperOverflow] > div > li > a[href]'));
            let links = elements.map(element => {
                return element.href
            })
            return links;
        });
        for (const link in categoryLinksResponse) {
            let links = await pageRedirect({
                page,
                link: categoryLinksResponse[link]
            })
            if (links.length) {
                fs.writeFileSync(`links/${link}.json`, JSON.stringify(links), function(err) {
                    if (err) throw err;
                    console.log('complete');
                })
            }
        }
        await browser.close();
        return true
    } catch (error) {
        await browser.close();
        console.log(error)
        return false
    }
}

async function asyncCall() {
    console.log(`Job Started : ${new Date().toLocaleString()}`)
    let triggerfn = await getData()
    let processFiles =await fs.readdirSync('links/');
    for (const file of processFiles) {
        const data =await fs.readFileSync(`links/${file}`);
        await fetchNumber({name:file, links:JSON.parse(data)})
    }
    console.log(processFiles)
    if (triggerfn) {
        console.log(`Job Processed : ${new Date().toLocaleString()}`)
    }
    console.log(`Job End : ${new Date().toLocaleString()}`)
}

asyncCall()