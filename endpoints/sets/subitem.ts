import { getBaseFolder, getAllSets, getAllCards } from "../util"
import Set from "@tcgdex/sdk/interfaces/Set"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import { fetchSet, isSetAvailable } from "../setUtil"
import { getAllCards2 } from "../util"
import Card from "@tcgdex/sdk/interfaces/Card"
import { cardToCardSingle, isCardAvailable } from "../cardUtil"
import { getExpansionFromSetName } from "../expansionUtil"

import Logger from '@dzeio/logger'
const logger = new Logger('sets/subitem')


const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "sets")

export default async () => {
	logger.log('Fetching Sets')
	const list = await getAllSets()
	for (let el of list) {
		const expansion = (await getExpansionFromSetName(el))
		const set: Set = await fetchSet(expansion.code, el)

		if (!isSetAvailable(set, lang)) continue

		const lit = await getAllCards(set.code, set?.expansionCode ?? set.expansion.code)
		logger.log('Fetching/Writing Cards for set', el)
		for (let i of lit) {
			const card: Card = (await import(i)).default

			if (!(await isCardAvailable(card, lang))) continue

			const localId = card.localId === '?' ? '%3F' : card.localId

			await fs.mkdir(`${endpoint}/${set.code}/${localId}`, {recursive: true})
			await fs.writeFile(`${endpoint}/${set.code}/${localId}/index.json`, JSON.stringify(await cardToCardSingle(card, lang)))
		}

	}

	logger.log('Finished')
}
