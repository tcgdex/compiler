import { getBaseFolder, getAllSets } from "../util"
import Set from "@tcgdex/sdk/interfaces/Set"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import { isSetAvailable } from "../setUtil"
import { getAllCards2 } from "../util"
import Card from "@tcgdex/sdk/interfaces/Card"
import { cardToCardSingle, isCardAvailable } from "../cardUtil"

import { logger as console } from '@dzeio/logger'
console.prefix = 'Sets/SubItem'


const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "sets")

export default async () => {
	console.log(endpoint)
	const list = await getAllSets()
	for (let el of list) {
		el = el.replace("./", "../../")
		const set: Set = require(el).default

		if (!isSetAvailable(set, lang)) continue

		const lit = await getAllCards2(set.code)
		for (let i of lit) {
			i = i.replace("./", "../../")
			const card: Card = require(i).default

			if (!isCardAvailable(card, lang)) continue

			await fs.mkdir(`${endpoint}/${set.code}/${card.localId}`, {recursive: true})
			await fs.writeFile(`${endpoint}/${set.code}/${card.localId}/index.json`, JSON.stringify(await cardToCardSingle(card, lang)))
		}

	}


	console.log('ended ' + endpoint)
}
