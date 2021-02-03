import { getAllCards, getBaseFolder, urlize } from "../util"
import { fetchCard, isCardAvailable, cardToCardSimple, fetchCardAsync } from "../cardUtil"
import Type, { TypeSingle } from "@tcgdex/sdk/interfaces/Type"
import Card from "@tcgdex/sdk/interfaces/Card"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { promises } from "fs"
import Tag, { TagSingle } from "@tcgdex/sdk/interfaces/Tag"

import Logger from '@dzeio/logger'
import { objectKeys, objectSize } from '@dzeio/object-util'
const logger = new Logger('tags/item')

type tagCards = {
	[key in Tag]?: Array<Card>
}

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "tags")


export default async () => {
	logger.log('Fetching cards')
	const list = await getAllCards()
	const arr: tagCards = {}
	for (const i of list) {
		const card: Card = (await import(i)).default

		if (!(await isCardAvailable(card, lang)) || !card.tags) continue

		for (const tag of card.tags) {
			if (!(tag in arr)) arr[tag] = []
			arr[tag].push(card)
		}
	}
	for (const type in arr) {
		if (arr.hasOwnProperty(type)) {
			const cards: Array<Card> = arr[type];

			const rTag: Tag = parseInt(type)
			logger.log('Working on tag', TranslationUtil.translate("tag", rTag, lang), `${type}/${objectSize(arr)}`)

			const toSave: TagSingle = {
				id: rTag,
				name: TranslationUtil.translate("tag", rTag, lang),
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
	logger.log('ended')
}
