import { getAllCards, getAllCards2 } from "../util"
import Card from "@tcgdex/sdk/interfaces/Card"

import { promises as fs} from "fs"
import { illustratorsFile, fetchIllustrators } from "../illustratorUtil"

const dbFile = illustratorsFile

export default async () => {
	const db = await fetchIllustrators()


	const list = await getAllCards()
	for (let i of list) {
		const card: Card = (await import(i)).default

		if (!card.illustrator) continue

		const illustrator = card.illustrator

		if (!db.includes(illustrator)) {
			db.push(illustrator)
		}
	}

	await fs.writeFile(dbFile, JSON.stringify(db))
}
