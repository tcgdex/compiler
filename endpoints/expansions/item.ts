import { getAllExpansions, fetchExpansion, expansionToExpansionSingle } from "../expansionUtil"
import { Langs } from "../../db/interfaces/LangList"
import { getBaseFolder } from "../util"
import { promises as fs } from 'fs'

const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "expansions")


const btsp = async () => {
	const list = getAllExpansions()
	for (const i of list) {
		const expansion = fetchExpansion(i)


		await fs.mkdir(`${endpoint}/${expansion.code}/`, {recursive: true})
		await fs.writeFile(`${endpoint}/${expansion.code}/index.json`, JSON.stringify(expansionToExpansionSingle(expansion, lang)))
	}
}

btsp()
