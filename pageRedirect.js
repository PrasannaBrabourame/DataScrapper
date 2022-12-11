/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  3.0.0                                                        *
 * Date         :  04 Sep 2022                                                  *
 * Author       :  https://github.com/PrasannaBrabourame                        *
 * Last updated :  10 Dec 2022                                                  *
 ********************************************************************************/

const {
    autoScroll
} = require('./helper')

/**
 * function used to scroll down to the page
 * @async
 * @function pageRedirect
 * @param {String} page - puppeteer browser page
 * @param {String} link - HTTPS URL of individual pages
 */
const pageRedirect = async (params) => {
    let batchIteration = [...Array(200)] // batch size
    let batchLinks = []
    const {
        page,
        link
    } = params
    try {
        console.log(link)
        if (link.includes("https://www.chotot.com/")) {
            for (const iterator in batchIteration) {
                await page.goto(`${link}?page=${iterator}`, {
                    waitUntil: 'domcontentloaded'
                });
                //Page Scrolling

                // await page.setViewport({
                //     width: 1200,
                //     height: 800
                // });
                // await autoScroll(page);
                let initLinks = await page.evaluate(() => {
                    let elements = Array.from(document.querySelectorAll('div[class^=ListAds_ListAds] > ul > div > li > a[href]'));
                    let links = elements.map(element => {
                        return element.href
                    })
                    return links;
                });
                batchLinks = [...batchLinks,...initLinks]
                console.log(batchLinks)
            }
        }
    return batchLinks
    } catch (err) {
        console.log(err)
        return batchLinks
    }
}

module.exports = pageRedirect