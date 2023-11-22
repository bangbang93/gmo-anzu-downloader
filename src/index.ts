import * as fse from "fs-extra"
import cheerio from "cheerio"
import got from "got"
import path from "path"

const BASE = "https://cloud.gmo.jp/anzu/"

//wallpaper
const page = await got.get(BASE)
const $ = cheerio.load(page.body)
let links = $(".remodal li a")
let urls: string[] = links
  .map((i, link) => cheerio(link).attr("href"))
  .toArray() as any[]

let i = 0
for (const url of urls) {
  console.log(`wallpaper ${++i} / ${urls.length}`)
  const filename = path.join(
    "download",
    url.includes("SP") ? "phone" : "pc",
    path.basename(url),
  )
  if (await fse.pathExists(filename)) {
    continue
  }
  const file = await got.get(`${BASE}${url}`, { responseType: "buffer" })
  await fse.outputFile(filename, file)
}

//em
const ems = $(".stamp-wrap img")
urls = ems.map((i, em) => cheerio(em).attr("src")).toArray() as any[]

i = 0
for (const url of urls) {
  console.log(`emoji ${++i} / ${urls.length}`)
  const filename = path.join("download/emotion", path.basename(url))
  if (await fse.pathExists(filename)) {
    continue
  }
  const file = await got.get(`${BASE}${url}`, { responseType: "buffer" })
  await fse.outputFile(filename, file)
}
