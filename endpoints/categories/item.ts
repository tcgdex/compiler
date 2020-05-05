import { getAllCards, getBaseFolder, urlize } from "../util"
import { fetchCard, isCardAvailable, cardToCardSimple } from "../cardUtil"
import Card from "@tcgdex/sdk/interfaces/Card"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { promises } from "fs"
import Category, { CategorySingle } from "@tcgdex/sdk/interfaces/Category"

type categoryCards = {
	[key in Category]?: Array<Card>
}

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "categories")


export default async () => {
	console.log(endpoint)
	const list = getAllCards()
	const arr: categoryCards = {}
	for (const i of list) {
		const card = await fetchCard(i)

		if (!isCardAvailable(card, lang)) continue

		const c = card.category

		if (!(c in arr)) arr[c] = []
		arr[c].push(card)

	}

	for (const cat in arr) {
		if (arr.hasOwnProperty(cat)) {
			const cards: Array<Card> = arr[cat];
			const rCat: Category = parseInt(cat)
			const toSave: CategorySingle = {
				id: rCat,
				name: TranslationUtil.translate("category", rCat, lang),
				cards: cards.map(el => cardToCardSimple(el, lang))
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
