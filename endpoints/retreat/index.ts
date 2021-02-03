import Card from "@tcgdex/sdk/interfaces/Card"
import { getAllCards, getAllCards2, getBaseFolder } from "../util"
import { promises as fs } from 'fs'
import { isCardAvailable } from "../cardUtil"
import { RetreatList } from '@tcgdex/sdk/interfaces/Retreat'
import { Langs } from "@tcgdex/sdk/interfaces/LangList"

import Logger from '@dzeio/logger'
const logger = new Logger('retreat/index')

const lang = (process.env.CARDLANG || "en") as Langs
const endpoint = getBaseFolder(lang, "retreat")

export default async () => {
	logger.log('Fetching Cards')
	const files = await getAllCards()
	const count: Array<number> = []
	for (let file of files) {
		const card: Card = (await import(file)).default

		if (
			!(await isCardAvailable(card, lang)) ||
			!card.retreat ||
			count.includes(card.retreat)
		) continue
		count.push(card.retreat)
	}

	const list: RetreatList = {
		count: count.length,
		list: count
	}
	logger.log('Writingto file')

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(list))
	logger.log('Finished')
}
