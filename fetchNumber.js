/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  3.0.0                                                        *
 * Date         :  04 Sep 2022                                                  *
 * Author       :  https://github.com/PrasannaBrabourame                        *
 * Last updated :  10 Dec 2022                                                  *
 ********************************************************************************/
const puppeteer = require('puppeteer');
/**
 * function used to fetch the individual html pages to getch mobile numbers
 * @async
 * @function async
 * @param {String} name - file name
 * @param {String} links - list of html urls
 */
const fetchNumber = async (params) => {
    let numbers = []
    let browser
    let page
    const {name, links} = params
    try {
        browser = await puppeteer.launch({
            headless: false
        });
        page = await browser.newPage();
        for (const link of links) {
            await page.goto(`${link}`);
            await page.waitForSelector('#call_phone_btn')
            let mobileNumber = await page.evaluate(() => {
               return document.querySelector('#call_phone_btn').href.split("tel:0")[1]
            });
            numbers.push(mobileNumber)
        }
        await browser.close();
        fs.writeFileSync(`numbers/${name}`, JSON.stringify(numbers), function(err) {
            if (err) throw err;
            console.log('complete');
        })
        return true
    } catch (err) {
        await browser.close();
        console.log(err)
        return false
    }
}

module.exports = fetchNumber