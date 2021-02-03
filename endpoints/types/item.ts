import { getAllCards, getBaseFolder, urlize } from "../util"
import { fetchCard, isCardAvailable, cardToCardSimple } from "../cardUtil"
import Type, { TypeSingle } from "@tcgdex/sdk/interfaces/Type"
import Card from "@tcgdex/sdk/interfaces/Card"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { promises } from "fs"

import Logger from '@dzeio/logger'
const logger = new Logger('types/item')
type typeCards = {
	[key in Type]?: Array<Card>
}

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "types")


export default async () => {
	logger.log('Fetching cards')
	const list = await getAllCards()
	const arr: typeCards = {}
	for (const i of list) {
		const card: Card = (await import(i)).default

		if (!(await isCardAvailable(card, lang)) || !card.type) continue

		for (const type of card.type) {
			if (!(type in arr)) arr[type] = []
			arr[type].push(card)
		}
	}

	for (const type in arr) {
		if (!Object.prototype.hasOwnProperty.call(arr, type)) {
			continue
		}
		const cards: Array<Card> = arr[type];
		const rType: Type = parseInt(type)
		logger.log('Processing type', TranslationUtil.translate("type", rType, lang))
		const toSave: TypeSingle = {
			id: rType,
			name: TranslationUtil.translate("type", rType, lang),
			cards: await Promise.all(cards.map(el => cardToCardSimple(el, lang)))
		}

		const index = `${endpoint}/${toSave.id}`
		const name = `${endpoint}/${urlize(toSave.name)}`

		await promises.mkdir(index, {recursive: true})
		await promises.mkdir(name, {recursive: true})

		await promises.writeFile(`${index}/index.json`, JSON.stringify(toSave))
		await promises.writeFile(`${name}/index.json`, JSON.stringify(toSave))
	}
	logger.log('Finished')
}
