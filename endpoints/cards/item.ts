import { getAllCards2, getBaseFolder } from "..//util"
import Card from "../../db/interfaces/Card"
import { Langs } from "../../db/interfaces/LangList"
import { promises as fs } from 'fs'
import { cardToCardSingle, isCardAvailable } from "../cardUtil"

const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "cards")

const bootstrap = async () => {
	const list = await getAllCards2()
	console.log(list)
	for (let el of list) {
		el = el.replace("./", "../../")
		const card: Card = require(el).default

		console.log(el)
		if (!isCardAvailable(card, lang)) continue

		await fs.mkdir(`${endpoint}/${card.id}/`, {recursive: true})
		await fs.writeFile(`${endpoint}/${card.id}/index.json`, JSON.stringify(cardToCardSingle(card, lang)))

		// if (if (typeof card.set.availability === "undefined"))
	}
}

bootstrap()
