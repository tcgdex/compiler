import { getBaseFolder, getAllSets } from "../util"
import Set from "@tcgdex/sdk/interfaces/Set"
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { promises as fs } from 'fs'
import { fetchSet, isSetAvailable, setToSetSingle } from "../setUtil"
import { getExpansionFromSetName } from "../expansionUtil"

import Logger from '@dzeio/logger'
const logger = new Logger('sets/item')

const lang = process.env.CARDLANG as Langs || "en"

const endpoint = getBaseFolder(lang, "sets")

export default async () => {
	logger.log('Fetching Sets')
	const list = await getAllSets()
	logger.log(list)
	for (let el of list) {
		logger.log('Processing set', el)
		const expansion = (await getExpansionFromSetName(el))
		const set: Set = await fetchSet(expansion.code, el)

		if (!isSetAvailable(set, lang)) continue

		await fs.mkdir(`${endpoint}/${set.code}/`, {recursive: true})
		await fs.writeFile(`${endpoint}/${set.code}/index.json`, JSON.stringify(await setToSetSingle(set, lang)))
	}


	logger.log('Finished')
}
