import Card from "@tcgdex/sdk/interfaces/Card"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import { CardList, CardSimple } from "@tcgdex/sdk/interfaces/Card"
import { cardToCardSimple, isCardAvailable } from "../cardUtil"
import { getBaseFolder, getAllCards2, getAllCards } from "../util"

import Logger from '@dzeio/logger'
const logger = new Logger('cards/index')


const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "cards")

export default async () => {
	logger.log('Fetching Cards')
	const list = await getAllCards()
	const items: Array<CardSimple> = []
	for (let el of list) {
		const card: Card = (await import(el)).default

		if (!(await isCardAvailable(card, lang))) continue
		items.push(
			await cardToCardSimple(card, lang)
		)

		// if (if (typeof card.set.availability === "undefined"))
	}

	const cardList: CardList = {
		count: items.length,
		list: items
	}
	logger.log('Writing')

	await fs.mkdir(`${endpoint}`, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(cardList))

	logger.log('Finished')
}
