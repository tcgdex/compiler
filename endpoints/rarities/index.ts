import { getBaseFolder } from "../util"
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import Rarity, { RaritySimple, RarityList } from "@tcgdex/sdk/interfaces/Rarity"

import Logger from '@dzeio/logger'
const logger = new Logger('rarities/index')


const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "rarities")

export default async () => {
	logger.log('Fetching Rarities')

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
	logger.log('Writing to file')
	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(res))
	logger.log('Finished')
}
