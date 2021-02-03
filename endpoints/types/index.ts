import Type, { TypeSimple } from "@tcgdex/sdk/interfaces/Type"
import TranslationUtil from "@tcgdex/sdk/TranslationUtil"
import { getBaseFolder } from "../util"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from "fs"
import { List } from "@tcgdex/sdk/interfaces/General"

const lang = process.env.CARDLANG as Langs || "en"
const endpoint = getBaseFolder(lang, "types")

import Logger from '@dzeio/logger'
const logger = new Logger('types/index')

export default async () => {
	logger.log('Fetching types')
	const typeArr: Array<TypeSimple> = []
	for (const i of Object.values(Type)) {
		if (typeof i !== "number") continue
		typeArr.push({
			id: i,
			name: TranslationUtil.translate("type", i, lang)
		})
	}

	const typeList: List<TypeSimple> = {
		count: typeArr.length,
		list: typeArr
	}

	logger.log('Writing types')
	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(typeList))
	logger.log('Finished')
}
