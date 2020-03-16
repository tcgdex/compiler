import Card from "@tcgdex/sdk/interfaces/Card"
import { getAllCards2, getBaseFolder } from "../util"
import { promises as fs } from 'fs'
import { isCardAvailable, cardToCardSimple } from "../cardUtil"
import { RetreatSingle } from '@tcgdex/sdk/interfaces/Retreat'
import { Langs } from "@tcgdex/sdk/interfaces/LangList"

const lang = (process.env.CARDLANG || "en") as Langs
const endpoint = getBaseFolder(lang, "retreat")

const btsp = async () => {
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
				cards: cardArr.map((val) => cardToCardSimple(val, lang))
			}

			await fs.mkdir(`${endpoint}/${item.id}`, {recursive: true})
			await fs.writeFile(`${endpoint}/${item.id}/index.json`, JSON.stringify(item))
		}
	}
}

btsp()
