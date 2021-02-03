import { getAllCards, getAllCards2, getBaseFolder } from "..//util"
import Card from "@tcgdex/sdk/interfaces/Card"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import { cardToCardSingle, isCardAvailable } from "../cardUtil"

import Logger from '@dzeio/logger'
const logger = new Logger('cards/item')


const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "cards")

export default async () => {
	logger.log('Fetching Cards')
	const list = await getAllCards()
	for (let el of list) {
		const card: Card = (await import(el)).default

		if (!(await isCardAvailable(card, lang))) continue

		try {
			await fs.mkdir(`${endpoint}/${encodeURI(card.id)}/`, {recursive: true})
			await fs.writeFile(`${endpoint}/${encodeURI(card.id)}/index.json`, JSON.stringify(await cardToCardSingle(card, lang)))
		} catch {

		}

		// if (if (typeof card.set.availability === "undefined"))
	}
	logger.log('Finished')
}
