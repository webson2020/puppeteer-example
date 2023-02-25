const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const cron = require('node-cron')

async function start() {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://learnwebcode.github.io/practice-requests/')
    // await page.screenshot({path: 'amazing.png', fullPage: true})

    const names = await page.evaluate(() => {
        // one manner for return a array or collections of elements
        return Array.from(document.querySelectorAll('.info strong')).map(e => e.textContent)
    })
    await fs.writeFile("names.txt", names.join("/r/n"))

    // this is for the buttons
    await page.click('#clickme')
    const clickedData = await page.$eval('#data', el => (el.textContent))
    console.log((clickedData))

    // second way for return a more specific collections of elements
    const photos = await page.$$eval('img', (imgs) => {
        return imgs.map(x => x.src)
    })

    await page.type('#ourfield', 'blue')

    await Promise.all([page.click('#ourform button'), page.waitForNavigation()])
    const info = await page.$eval('#message',el => el.textContent)
    console.log(info);


    for (const photo of photos) {
        const imagePage = await page.goto(photo)
        await fs.writeFile(photo.split('/').pop(), await imagePage.buffer());
    }

    await browser.close();
}

cron.schedule('*/5 * * * * *', start)