import Card from "@tcgdex/sdk/interfaces/Card"
import { getAllCards2, getBaseFolder } from "../util"
import { promises as fs } from 'fs'
import { isCardAvailable, cardToCardSimple } from "../cardUtil"
import { RetreatSingle } from '@tcgdex/sdk/interfaces/Retreat'
import { Langs } from "@tcgdex/sdk/interfaces/LangList"

import { logger as console } from '@dzeio/logger'
console.prefix = 'Retreat/Item'

const lang = (process.env.CARDLANG || "en") as Langs
const endpoint = getBaseFolder(lang, "retreat")

export default async () => {
	console.log(endpoint)
	const files = await getAllCards2()
	const count: Array<Array<Card>> = []
	for (let file of files) {
		file = file.replace("./", "../../")
		const card: Card = await require(file).default

		if (
			!isCardAvailable(card, lang) ||
			!card.retreat
		) continue
		if (!(card.retreat in count)) count[card.retreat] = []
		count[card.retreat].push(card)
	}

	for (const retreat in count) {
		if (count.hasOwnProperty(retreat)) {
			const cardArr = count[retreat];

			const item: RetreatSingle = {
				id: retreat as unknown as number,
				cards: await Promise.all(cardArr.map(el => cardToCardSimple(el, lang)))
			}

			await fs.mkdir(`${endpoint}/${item.id}`, {recursive: true})
			await fs.writeFile(`${endpoint}/${item.id}/index.json`, JSON.stringify(item))
		}
	}
	console.log('ended ' + endpoint)
}
