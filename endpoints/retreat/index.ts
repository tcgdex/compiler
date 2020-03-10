import Card from "../../db/interfaces/Card"
import { getAllCards2, getBaseFolder } from "../util"
import { promises as fs } from 'fs'
import { isCardAvailable } from "../cardUtil"
import { RetreatList } from '../../sdk/dist/types/interfaces/Retreat'
import { Langs } from "../../db/interfaces/LangList"

const lang = (process.env.CARDLANG || "en") as Langs
const endpoint = getBaseFolder(lang, "retreat")

const btsp = async () => {
	const files = await getAllCards2()
	const count: Array<number> = []
	for (let file of files) {
		file = file.replace("./", "../../")
		const card: Card = await require(file).default

		if (
			!isCardAvailable(card, lang) ||
			!card.retreat ||
			count.includes(card.retreat)
		) continue
		console.log(file)
		count.push(card.retreat)
	}

	const list: RetreatList = {
		count: count.length,
		list: count
	}

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(list))
}

btsp()
