import { promises as fs} from "fs"
import * as fsSync from 'fs'
import { IllustratorSimple } from "@tcgdex/sdk/interfaces/Illustrator"

export const illustratorsFile = "./generated/illustrators.json"

let illustratorsCache: Array<string> = []


export async function fetchIllustrators(): Promise<Array<string>> {
	if (illustratorsCache.length === 0) {
		illustratorsCache = JSON.parse(await (await fs.readFile(illustratorsFile)).toString())
	}
	return illustratorsCache
}

export function fetchIllustratorsSync(): Array<string> {
	if (illustratorsCache.length === 0) {
		illustratorsCache = JSON.parse(fsSync.readFileSync(illustratorsFile).toString())
	}
	return illustratorsCache
}

export function illustratorToIllustratorSimple(illustrator: string, index: number): IllustratorSimple {
	return {
		id: index,
		name: illustrator
	}
}
