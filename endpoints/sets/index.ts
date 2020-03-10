import Set from "../../db/interfaces/Set"
import { Langs } from "../../db/interfaces/LangList"
import { promises as fs } from 'fs'
import { SetSimple, SetList } from "../../sdk/dist/types/interfaces/Set"
import { getAllSets, getBaseFolder } from "../util"
import { isSetAvailable, setToSetSimple } from "../setUtil"

const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "sets")

const bootstrap = async () => {
	const list = await getAllSets()
	const items: Array<SetSimple> = []
	for (let el of list) {
		el = el.replace("./", "../../")
		const set: Set = require(el).default

		console.log(el)
		if (!isSetAvailable(set, lang)) continue
		items.push(
			setToSetSimple(set, lang)
		)
	}

	const cardList: SetList = {
		count: items.length,
		list: items
	}

	await fs.mkdir(`${endpoint}`, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(cardList))

}

console.log("Building sets/index")

bootstrap()
