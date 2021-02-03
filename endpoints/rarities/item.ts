import { getAllCards, getBaseFolder, urlize } from "../util"
import { fetchCard, isCardAvailable, cardToCardSimple, fetchCardAsync } from "../cardUtil"
import Card from "@tcgdex/sdk/interfaces/Card"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { promises } from "fs"
import Rarity, { RaritySingle } from "@tcgdex/sdk/interfaces/Rarity"

import { logger as console } from '@dzeio/logger'
console.prefix = 'Rarities/Item'


type rarityCards = {
	[key in Rarity]?: Array<Card>
}

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "rarities")


export default async () => {
	console.log(endpoint)
	const list = getAllCards()
	const arr: rarityCards = {}
	for (const i of list) {
		const card = await fetchCardAsync(i)

		if (!isCardAvailable(card, lang)) continue

		const c = card.rarity

		if (!(c in arr)) arr[c] = []
		arr[c].push(card)

	}

	for (const cat in arr) {
		if (arr.hasOwnProperty(cat)) {
			const cards: Array<Card> = arr[cat];
			const rCat: Rarity = parseInt(cat)
			const toSave: RaritySingle = {
				id: rCat,
				name: TranslationUtil.translate("rarity", rCat, lang),
				cards: await Promise.all(cards.map(el => cardToCardSimple(el, lang)))
			}

			const index = `${endpoint}/${toSave.id}`
			const name = `${endpoint}/${urlize(toSave.name)}`

			await promises.mkdir(index, {recursive: true})
			await promises.mkdir(name, {recursive: true})

			await promises.writeFile(`${index}/index.json`, JSON.stringify(toSave))
			await promises.writeFile(`${name}/index.json`, JSON.stringify(toSave))
		}
	}
	console.log('ended ' + endpoint)
}
