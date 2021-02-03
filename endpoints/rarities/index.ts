import { getBaseFolder } from "../util"
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import Rarity, { RaritySimple, RarityList } from "@tcgdex/sdk/interfaces/Rarity"

import { logger as console } from '@dzeio/logger'
console.prefix = 'Rarities/Index'


const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "rarities")

export default async () => {
	console.log(endpoint)

	const list: Array<RaritySimple> = []
	for (const cat of Object.values(Rarity)) {
		if (typeof cat !== "number") continue
		list.push({
			id: cat,
			name: TranslationUtil.translate("rarity", cat, lang)
		})
	}

	const res: RarityList = {
		count: list.length,
		list: list
	}

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(res))
	console.log('ended ' + endpoint)
}
