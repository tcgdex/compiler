import { getBaseFolder, getAllSets } from "../util"
import Set from "@tcgdex/sdk/interfaces/Set"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import { isSetAvailable, setToSetSingle } from "../setUtil"

const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "sets")

const bootstrap = async () => {
	const list = await getAllSets()
	for (let el of list) {
		el = el.replace("./", "../../")
		const set: Set = require(el).default

		if (!isSetAvailable(set, lang)) continue

		await fs.mkdir(`${endpoint}/${set.code}/`, {recursive: true})
		await fs.writeFile(`${endpoint}/${set.code}/index.json`, JSON.stringify(setToSetSingle(set, lang)))
	}


}

bootstrap()
