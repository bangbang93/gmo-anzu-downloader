import path from "path"
import cheerio from "cheerio"
import * as fse from "fs-extra"
import got from "got"

const BASE = "https://cloud.gmo.jp/anzu/"

//wallpaper
const page = await got.get(BASE)
const $ = cheerio.load(page.body)
const links = $(".remodal li a")
let urls = links
  .map((i, link) => cheerio(link).attr("href"))
  .toArray() as unknown as string[]

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
urls = ems
  .map((i, em) => cheerio(em).attr("src"))
  .toArray() as unknown as string[]

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
