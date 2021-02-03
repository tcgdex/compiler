import { fetchIllustrators, illustratorToIllustratorSimple } from "../illustratorUtil"
import { IllustratorsList } from "@tcgdex/sdk/interfaces/Illustrator"
import { getBaseFolder } from "../util"
import { promises as fs} from "fs"

import Logger from '@dzeio/logger'
const logger = new Logger('illustrators/index')

const lang = process.env.CARDLANG || "en"
const endpoint = getBaseFolder(lang, "illustrators")

export default async () => {
	logger.log('Fetching illustrators')

	const db = await fetchIllustrators()

	const res: IllustratorsList = {
		count: db.length,
		list: db.map((ill, index) => illustratorToIllustratorSimple(ill, index))
	}

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(res))
	logger.log('Finished')
}
