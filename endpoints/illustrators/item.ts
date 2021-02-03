import { fetchIllustrators } from "../illustratorUtil"
import { IllustratorSingle } from "@tcgdex/sdk/interfaces/Illustrator"
import { getBaseFolder, getAllCards } from "../util"
import { promises as fs} from "fs"
import Card from "@tcgdex/sdk/interfaces/Card"
import { isCardAvailable, cardToCardSimple } from "../cardUtil"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"

import Logger from '@dzeio/logger'
const logger = new Logger('illustrators/item')

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "illustrators")

interface t {
	[key: string]: Array<Card>
}

export default async () => {
	logger.log('Fetching Illustrators/Cards')

	const db = await fetchIllustrators()
	const cards = await getAllCards()

	const tmp: t = {}


	for (const i of cards) {
		const card: Card = (await import(i)).default

		if (!(await isCardAvailable(card, lang)) || !card.illustrator) continue

		if (!(card.illustrator in tmp)) tmp[card.illustrator] = []
		tmp[card.illustrator].push(card)
	}

	for (const illustrator in tmp) {
		if (tmp.hasOwnProperty(illustrator)) {
			logger.log('Processing illustrator', illustrator)
			const list = tmp[illustrator];

			const toSave: IllustratorSingle = {
				id: db.indexOf(illustrator),
				name: illustrator,
				cards: await Promise.all(list.map(el => cardToCardSimple(el, lang)))
			}

			await fs.mkdir(`${endpoint}/${toSave.id}`, {recursive: true})
			await fs.writeFile(`${endpoint}/${toSave.id}/index.json`, JSON.stringify(toSave))
		}
	}
	logger.log('Finished')
}
