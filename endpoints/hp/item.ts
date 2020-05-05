import { getAllCards, getBaseFolder } from "../util"
import { fetchCard, isCardAvailable, cardToCardSimple } from "../cardUtil"
import Card from "@tcgdex/sdk/interfaces/Card"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { HpSingle } from "@tcgdex/sdk/interfaces/Hp"
import { promises as fs } from 'fs'

interface t {
	[key: number]: Array<Card>
}

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "hp")

export default async () => {
	console.log(endpoint)
	const files = getAllCards()
	const pools: t = {}
	for (const file of files) {
		const card = fetchCard(file)

		if (!isCardAvailable(card, lang) || !card.hp) continue

		if (!(card.hp in pools)) pools[card.hp] = []
		pools[card.hp].push(card)
	}

	for (const hp in pools) {
		if (pools.hasOwnProperty(hp)) {
			const cards = pools[hp];

			const toSave: HpSingle = {
				hp: hp as unknown as number,
				cards: cards.map(el => cardToCardSimple(el, lang))
			}

			await fs.mkdir(`${endpoint}/${toSave.hp}/`, {recursive: true})
			await fs.writeFile(`${endpoint}/${toSave.hp}/index.json`, JSON.stringify(toSave))
		}
	}
	console.log('ended ' + endpoint)
}
