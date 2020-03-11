import { getBaseFolder, getAllSets } from "../util"
import Set from "@tcgdex/sdk/interfaces/Set"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import { isSetAvailable } from "../setUtil"
import { getAllCards2 } from "../util"
import Card from "@tcgdex/sdk/interfaces/Card"
import { cardToCardSingle, isCardAvailable } from "../cardUtil"

const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "sets")

const bootstrap = async () => {
	const list = await getAllSets()
	for (let el of list) {
		el = el.replace("./", "../../")
		const set: Set = require(el).default

		console.log(el)
		if (!isSetAvailable(set, lang)) continue

		const lit = await getAllCards2(set.code)
		for (let i of lit) {
			i = i.replace("./", "../../")
			const card: Card = require(i).default

			if (!isCardAvailable(card, lang)) continue
			console.log(i)

			await fs.mkdir(`${endpoint}/${set.code}/${card.localId}`, {recursive: true})
			await fs.writeFile(`${endpoint}/${set.code}/${card.localId}/index.json`, JSON.stringify(cardToCardSingle(card, lang)))
		}

	}


}

console.log("Building sets/subitem")

bootstrap()
