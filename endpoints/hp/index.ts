import { getAllCards, getBaseFolder } from "../util"
import { fetchCard, isCardAvailable } from "../cardUtil"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { HpList } from "@tcgdex/sdk/interfaces/Hp"
import { promises as fs } from 'fs'

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "hp")


export default async () => {
	console.log(endpoint)
	const cards = getAllCards()

	const hps: Array<number> = []

	for (const i of cards) {
		const card = fetchCard(i)
		if (!isCardAvailable(card, lang) || !card.hp) continue

		if (hps.includes(card.hp)) continue
		hps.push(card.hp)
	}

	const hpList: HpList = {
		count: hps.length,
		list: hps.sort((a, b) => a > b ? 1 : -1)
	}

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(hpList))

	console.log('ended ' + endpoint)
}
