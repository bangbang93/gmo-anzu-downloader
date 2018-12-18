import * as request from 'request-promise'
import * as fs from 'fs-extra'
import * as cheerio from 'cheerio'
import * as path from 'path'


(async function main() {
  //wallpaper
  const page = await request.get('https://cloud.gmo.jp/anzu/')
  const $ = cheerio.load(page)
  let links = $('.remodal li a')
  let urls: string[] = links.map((i, link) => cheerio(link).attr('href')).toArray() as any[]

  let i = 0
  for (const url of urls) {
    console.log(`wallpaper ${++i} / ${urls.length}`)
    const filename = path.join('download', url.includes('SP')? 'phone': 'pc', path.basename(url))
    if (await fs.pathExists(filename)) {
      continue
    }
    const file = await request.get('https://cloud.gmo.jp/anzu/' + url, {encoding: null})
    await fs.outputFile(filename, file)
  }

  //em
  const ems = $('.stamp-wrap img')
  urls = ems.map((i, em) => cheerio(em).attr('src')).toArray() as any[]

  i = 0
  for (const url of urls) {
    console.log(`emoji ${++i} / ${urls.length}`)
    const filename = path.join('download/emotion', path.basename(url))
    if (await fs.pathExists(filename)) {
      continue
    }
    const file = await request.get('https://cloud.gmo.jp/anzu/' + url, {encoding: null})
    await fs.outputFile(filename, file)
  }
})()
