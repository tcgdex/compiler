import Set from "@tcgdex/sdk/interfaces/Set"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import { SetSimple, SetList } from "@tcgdex/sdk/interfaces/Set"
import { getAllSets, getBaseFolder } from "../util"
import { isSetAvailable, setToSetSimple } from "../setUtil"

const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "sets")

const bootstrap = async () => {
	const list = await getAllSets()
	let items: Array<Set> = []
	for (let el of list) {
		el = el.replace("./", "../../")
		const set: Set = require(el).default

		if (!isSetAvailable(set, lang)) continue
		items.push(
			set
		)
	}

	items = items.sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1)

	const tmp: Array<SetSimple> = items.map((el) => setToSetSimple(el, lang))

	const cardList: SetList = {
		count: tmp.length,
		list: tmp
	}

	await fs.mkdir(`${endpoint}`, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(cardList))

}

bootstrap()
