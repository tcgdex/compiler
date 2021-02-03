import Expansion from "@tcgdex/sdk/interfaces/Expansion"
import Set from "@tcgdex/sdk/interfaces/Set"
import * as glob from 'glob'
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { ExpansionSingle } from "@tcgdex/sdk/interfaces/Expansion"
import { getAllSets } from "./util"
import { setToSetSimple, fetchSet } from "./setUtil"

export function getExpansion(set: Set): Expansion {
	if ("expansion" in set) return set.expansion
	return require(`../../db/expansions/${set.expansionCode}`)
}

const setExpansionLink: Record<string, string> = {}

export function getExpansionFromSetName(setName: string): Expansion {
	try {
		if (!setExpansionLink[setName]) {
			setExpansionLink[setName] = glob.sync(`./db/sets/**/${setName}.ts`)[0].split('/')[3]
		}
		const expansionName = setExpansionLink[setName]
		return fetchExpansion(expansionName)
	} catch (e) {
		console.error(glob.sync(`./db/sets/**/${setName}`))
		throw new Error(setName)
	}
}

export function getAllExpansions(): Array<string> {
	return glob.sync("./db/expansions/*.ts").map(el => el.split('/')[3].substr(0, el.length-1-3)) // -15 = start -1 = 0 index -3 = .ts
}

const expansionCache: Record<string, Expansion> = {}

export function fetchExpansion(name: string): Expansion {
	name = name.replace('.ts', '')
	if (!expansionCache[name]) {
		expansionCache[name] = require(`../db/expansions/${name}.js`).default
	}
	return expansionCache[name]
}

export function expansionToExpansionSimple(expansion: Expansion, lang: Langs) {
	return {
		code: expansion.code,
		name: typeof expansion.name === "string" ? expansion.name : expansion.name[lang]
	}
}

export function expansionToExpansionSingle(expansion: Expansion, lang: Langs): ExpansionSingle {
	const sets = getAllSets(expansion.code, true)
		.map(el => fetchSet(expansion.code, el))
		.sort((a, b) => {
			return a.releaseDate > b.releaseDate ? 1 : -1
		})
		.map(el => setToSetSimple(el, lang))
	return {
		code: expansion.code,
		name: typeof expansion.name === "string" ? expansion.name : expansion.name[lang],
		sets
	}
}
