import { fetchIllustrators, illustratorToIllustratorSimple } from "../illustratorUtil"
import { IllustratorsList } from "../../sdk/dist/types/interfaces/Illustrator"
import { getBaseFolder } from "../util"
import { promises as fs} from "fs"

const lang = process.env.CARDLANG || "en"
const endpoint = getBaseFolder(lang, "illustrators")

const btsp = async () => {

	const db = await fetchIllustrators()

	const res: IllustratorsList = {
		count: db.length,
		list: db.map((ill, index) => illustratorToIllustratorSimple(ill, index))
	}

	await fs.mkdir(endpoint, {recursive: true})
	await fs.writeFile(`${endpoint}/index.json`, JSON.stringify(res))
}

btsp()
