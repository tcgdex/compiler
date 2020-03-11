import { getBaseFolder } from "../util"
import Category from '@tcgdex/sdk/interfaces/Category'
import { categorySimple, categoryList } from "./category"
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "categories")

const btsp = async () => {

	const list: Array<categorySimple> = []
	for (const cat of Object.values(Category)) {
		if (typeof cat !== "number") continue
		list.push({
			id: cat,
			name: TranslationUtil.translate("category", cat, lang)
		})
	}

	const res: categoryList = {
		count: list.length,
		list: list
	}

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(res))
}
btsp()
