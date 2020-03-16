import Card from "@tcgdex/sdk/interfaces/Card"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import { CardList, CardSimple } from "@tcgdex/sdk/interfaces/Card"
import { cardToCardSimple, isCardAvailable } from "../cardUtil"
import { getBaseFolder, getAllCards2 } from "../util"

const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "cards")

const bootstrap = async () => {
	const list = await getAllCards2()
	const items: Array<CardSimple> = []
	for (let el of list) {
		el = el.replace("./", "../../")
		const card: Card = require(el).default

		if (!isCardAvailable(card, lang)) continue
		items.push(
			cardToCardSimple(card, lang)
		)

		// if (if (typeof card.set.availability === "undefined"))
	}

	const cardList: CardList = {
		count: items.length,
		list: items
	}

	await fs.mkdir(`${endpoint}`, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(cardList))

}

bootstrap()
