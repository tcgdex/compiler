import { getAllExpansions, fetchExpansion, expansionToExpansionSingle } from "../expansionUtil"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { getBaseFolder } from "../util"
import { promises as fs } from 'fs'

import Logger from '@dzeio/logger'
const logger = new Logger('expansions/index')

const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "expansions")


export default async () => {
	logger.log('Fetching Expansions')
	const list = await getAllExpansions()
	for (const i of list) {
		logger.log('Processing Expansion', i)
		const expansion = await fetchExpansion(i)


		await fs.mkdir(`${endpoint}/${expansion.code}/`, {recursive: true})
		await fs.writeFile(`${endpoint}/${expansion.code}/index.json`, JSON.stringify(await expansionToExpansionSingle(expansion, lang)))
	}
	logger.log('Finished')
}
