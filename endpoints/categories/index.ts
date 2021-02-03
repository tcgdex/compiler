import { getBaseFolder } from "../util"
import Category, { CategorySimple, CategoryList } from '@tcgdex/sdk/interfaces/Category'
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'

import Logger from '@dzeio/logger'
const logger = new Logger('category/index')

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "categories")


export default async () => {
	logger.log('Fetching Categories')

	const list: Array<CategorySimple> = []
	for (const cat of Object.values(Category)) {
		if (typeof cat !== "number") continue
		list.push({
			id: cat,
			name: TranslationUtil.translate("category", cat, lang)
		})
	}

	const res: CategoryList = {
		count: list.length,
		list: list
	}
	logger.log('Writing')

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(res))
	logger.log('Finished')
}
