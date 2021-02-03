import Set from "@tcgdex/sdk/interfaces/Set"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import { SetSimple, SetList } from "@tcgdex/sdk/interfaces/Set"
import { getAllSets, getBaseFolder } from "../util"
import { fetchSet, isSetAvailable, setToSetSimple } from "../setUtil"

import Logger from '@dzeio/logger'
import { getExpansionFromSetName } from "../expansionUtil"
const logger = new Logger('sets/index')


const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "sets")

export default async () => {
	logger.log('Fetching sets')

	const list = await getAllSets()
	let items: Array<Set> = []
	for (let el of list) {
		const expansion = (await getExpansionFromSetName(el))
		const set: Set = await fetchSet(expansion.code, el)

		if (!isSetAvailable(set, lang)) continue
		items.push(
			set
		)
	}
	logger.log('Procesing Sets')

	items = items.sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1)

	const tmp: Array<SetSimple> = items.map((el) => setToSetSimple(el, lang))

	const cardList: SetList = {
		count: tmp.length,
		list: tmp
	}

	await fs.mkdir(`${endpoint}`, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(cardList))

	logger.log('Finished')
}
