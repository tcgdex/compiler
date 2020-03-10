import { fetchIllustrators } from "../illustratorUtil"
import { IllustratorSingle } from "../../sdk/dist/types/interfaces/Illustrator"
import { getBaseFolder, getAllCards } from "../util"
import { promises as fs} from "fs"
import Card from "../../db/interfaces/Card"
import { isCardAvailable, cardToCardSimple } from "../cardUtil"
import { Langs } from "../../db/interfaces/LangList"

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "illustrators")

interface t {
	[key: string]: Array<Card>
}

const btsp = async () => {

	const db = await fetchIllustrators()
	const cards = getAllCards()

	const tmp: t = {}


	for (const i of cards) {
		const card: Card = require(`../../db/cards/${i}`).default

		if (!isCardAvailable(card, lang) || !card.illustrator) continue

		if (!(card.illustrator in tmp)) tmp[card.illustrator] = []
		tmp[card.illustrator].push(card)
	}

	for (const illustrator in tmp) {
		if (tmp.hasOwnProperty(illustrator)) {
			const list = tmp[illustrator];

			const toSave: IllustratorSingle = {
				id: db.indexOf(illustrator),
				name: illustrator,
				cards: list.map(el => cardToCardSimple(el, lang))
			}

			await fs.mkdir(`${endpoint}/${toSave.id}`, {recursive: true})
			await fs.writeFile(`${endpoint}/${toSave.id}/index.json`, JSON.stringify(toSave))
		}
	}
}

btsp()
