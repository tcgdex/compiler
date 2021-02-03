import { getAllCards, getBaseFolder } from "../util"
import { fetchCard, isCardAvailable, cardToCardSimple } from "../cardUtil"
import Card from "@tcgdex/sdk/interfaces/Card"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { HpSingle } from "@tcgdex/sdk/interfaces/Hp"
import { promises as fs } from 'fs'

import Logger from '@dzeio/logger'
const logger = new Logger('hp/item')

interface t {
	[key: number]: Array<Card>
}

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "hp")

export default async () => {
	logger.log('Fetching Cards')
	const files = await getAllCards()
	const pools: t = {}
	for (const file of files) {
		const card: Card = (await import(file)).default

		if (!(await isCardAvailable(card, lang)) || !card.hp) continue

		if (!(card.hp in pools)) pools[card.hp] = []
		pools[card.hp].push(card)
	}

	for (const hp in pools) {
		if (pools.hasOwnProperty(hp)) {
			logger.log('Processing HP', hp)
			const cards = pools[hp];

			const toSave: HpSingle = {
				hp: hp as unknown as number,
				cards: await Promise.all(cards.map(el => cardToCardSimple(el, lang)))
			}

			await fs.mkdir(`${endpoint}/${toSave.hp}/`, {recursive: true})
			await fs.writeFile(`${endpoint}/${toSave.hp}/index.json`, JSON.stringify(toSave))
		}
	}
	logger.log('Finished')
}
