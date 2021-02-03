import { getBaseFolder } from "../util"
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import Tag, { TagSimple, TagList } from "@tcgdex/sdk/interfaces/Tag"

import Logger from '@dzeio/logger'
const logger = new Logger('Tags/Index')

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "tags")

export default async () => {
	logger.log(endpoint)

	const list: Array<TagSimple> = []
	for (const cat of Object.values(Tag)) {
		if (typeof cat !== "number") continue
		list.push({
			id: cat,
			name: TranslationUtil.translate("tag", cat, lang)
		})
	}

	const res: TagList = {
		count: list.length,
		list: list
	}

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(res))
	logger.log('ended ' + endpoint)
}
