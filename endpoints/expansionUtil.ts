import Expansion from "@tcgdex/sdk/interfaces/Expansion"
import Set from "@tcgdex/sdk/interfaces/Set"
import * as glob from 'glob'
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { ExpansionSingle } from "@tcgdex/sdk/interfaces/Expansion"
import { getAllSets, smartGlob } from "./util"
import { setToSetSimple, fetchSet } from "./setUtil"
import Logger from "@dzeio/logger"

const logger = new Logger('ExpansionUtils')

export function getExpansion(set: Set): Expansion {
	if ("expansion" in set) return set.expansion
	return require(`../../db/expansions/${set.expansionCode}`)
}

export async function getExpansionFromSetName(setName: string): Promise<Expansion> {
	try {
		const expansionName = (await smartGlob(`./db/sets/**/${setName}.js`))[0].split('/')[3].replace('.js', '')
		return fetchExpansion(expansionName)
	} catch (e) {
		logger.error(e, setName)
		throw new Error(setName)
	}
}

export async function getAllExpansions(): Promise<Array<string>> {
	return (await smartGlob('./db/expansions/*.js')).map((it) => it.substring(it.lastIndexOf('/') + 1, it.length - 3)) // -15 = start -1 = 0 index -3 = .ts
}

export async function fetchExpansion(name: string): Promise<Expansion> {
	return (await import(`../db/expansions/${name}.js`)).default
}

export function expansionToExpansionSimple(expansion: Expansion, lang: Langs) {
	return {
		code: expansion.code,
		name: typeof expansion.name === "string" ? expansion.name : expansion.name[lang]
	}
}

export async function expansionToExpansionSingle(expansion: Expansion, lang: Langs): Promise<ExpansionSingle> {
	const setsTmp = await Promise.all((await getAllSets(expansion.code))
		.map(el => fetchSet(expansion.code, el)))
	const sets = setsTmp.sort((a, b) => {
			return a.releaseDate > b.releaseDate ? 1 : -1
		})
		.map(el => setToSetSimple(el, lang))
	return {
		code: expansion.code,
		name: typeof expansion.name === "string" ? expansion.name : expansion.name[lang],
		sets
	}
}
