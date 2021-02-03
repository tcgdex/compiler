import { getBaseFolder } from "../util"
import Category, { CategorySimple, CategoryList } from '@tcgdex/sdk/interfaces/Category'
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import Logger from '@dzeio/logger'

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "categories")

const logger = new Logger('Category/Index')

export default async () => {
	logger.log(endpoint)

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

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(res))
	logger.log('ended')
}
