import { getAllExpansions, expansionToExpansionSimple } from "../expansionUtil"
import Expansion from "@tcgdex/sdk/interfaces/Expansion"
import { getAllSets, getBaseFolder } from "../util"
import { fetchSet } from "../setUtil"
import { promises as fs } from 'fs'
import { ExpansionList } from '@tcgdex/sdk/interfaces/Expansion'
import { Langs } from "@tcgdex/sdk/interfaces/LangList"

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "expansions")


const btsp = async () => {
	const expansions = getAllExpansions()
	let list: Array<{
		release: string,
		expansion: Expansion
	}> = []
	for (const i of expansions) {
		const expansion: Expansion = require(`../../db/expansions/${i}`).default
		const sets = getAllSets(expansion.code, true)
		expansion.sets = sets
		let oldestRelease = "9999-99-99"
		for (const j of sets) {
			console.log(j)
			const set = fetchSet(expansion.code, j)
			oldestRelease = set.releaseDate < oldestRelease ? set.releaseDate : oldestRelease
		}
		list.push({
			release: oldestRelease,
			expansion
		})
	}
	list = list.sort((a, b) => a.release > b.release ? 1 : -1)
	const finalList = list.map(el => el.expansion)

	const res: ExpansionList = {
		count: finalList.length,
		list: finalList.map(el => expansionToExpansionSimple(el, lang))
	}

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(res))
}

btsp()
