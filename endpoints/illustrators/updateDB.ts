import { getAllCards2 } from "../util"
import Card from "@tcgdex/sdk/interfaces/Card"

import { promises as fs} from "fs"
import { illustratorsFile, fetchIllustrators } from "../illustratorUtil"

const dbFile = illustratorsFile

const btsp = async () => {
	const db = await fetchIllustrators()


	const list = getAllCards2()
	for (let i of list) {
		i = i.replace("./", "../../")
		const card: Card = require(i).default

		if (!card.illustrator) continue

		const illustrator = card.illustrator

		if (!db.includes(illustrator)) {
			db.push(illustrator)
		}
	}

	await fs.writeFile(dbFile, JSON.stringify(db))
}

btsp()
