import { basename, dirname, join } from 'path'
import cheerio from 'cheerio'
import fse from 'fs-extra'
import got from 'got'

const BASE = 'https://conoha.mikumo.com'

const request = got.extend({
  prefixUrl: BASE,
  https: {
    rejectUnauthorized: false,
  },
})

//wallpaper
const page = await request.get('anzu')
const $ = cheerio.load(page.body)
await fetchPhoneImages($)
await fetchPcImages($)

async function fetchPhoneImages($: CheerioStatic): Promise<void> {
  const urls = $('.listWallpaper_item .inputSelectUnit:nth-child(1) li a')
    .map((i, link) => cheerio(link).attr('href'))
    .toArray() as unknown as string[]

  await downloadUrls(urls, 'phone')
}

async function fetchPcImages($: CheerioStatic): Promise<void> {
  const urls = $('.listWallpaper_item .inputSelectUnit:nth-child(2) li a')
    .map((i, link) => cheerio(link).attr('href'))
    .toArray() as unknown as string[]
  await downloadUrls(urls, 'pc')
}

async function downloadUrls(urls: string[], path: string): Promise<void> {
  for (const [i, url] of urls.entries()) {
    console.log(`${path} ${i} / ${urls.length}`)
    const fileIndex = basename(dirname(url))
    const filename = join('download', path, `${fileIndex}_${basename(url)}`)
    if (await fse.pathExists(filename)) {
      continue
    }
    console.log(url)
    const file = await request.get(url.replace(/^\//, ''), {
      responseType: 'buffer',
    })
    await fse.outputFile(filename, file.body)
  }
}
