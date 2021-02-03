import { getAllCards, getBaseFolder, urlize } from "../util"
import { fetchCard, isCardAvailable, cardToCardSimple } from "../cardUtil"
import Card from "@tcgdex/sdk/interfaces/Card"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { promises } from "fs"
import Category, { CategorySingle } from "@tcgdex/sdk/interfaces/Category"

import Logger from '@dzeio/logger'
const logger = new Logger('category/item')

type categoryCards = {
	[key in Category]?: Array<Card>
}

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "categories")



export default async () => {
	logger.log('Fetching Cards')
	const list = await getAllCards()
	const arr: categoryCards = {}
	for (const i of list) {
		const card: Card = (await import(i)).default

		if (!(await isCardAvailable(card, lang))) continue

		const c = card.category

		if (!(c in arr)) arr[c] = []
		arr[c].push(card)

	}

	for (const cat in arr) {
		if (arr.hasOwnProperty(cat)) {
			const cards: Array<Card> = arr[cat];
			const rCat: Category = parseInt(cat)
			logger.log('Processing Category', TranslationUtil.translate("category", rCat, lang))
			const toSave: CategorySingle = {
				id: rCat,
				name: TranslationUtil.translate("category", rCat, lang),
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
	logger.log('ended ' + endpoint)
}
