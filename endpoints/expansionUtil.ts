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

export function getAllExpansions(): Array<string> {
	return glob.sync("./db/expansions/*.ts").map(el => el.substr(16, el.length-15-1-3)) // -15 = start -1 = 0 index -3 = .ts
}

export function fetchExpansion(name: string): Expansion {
	return require(`../db/expansions/${name}.js`).default
}

export function expansionToExpansionSimple(expansion: Expansion, lang: Langs) {
	return {
		code: expansion.code,
		name: typeof expansion.name === "string" ? expansion.name : expansion.name[lang]
	}
}

export function expansionToExpansionSingle(expansion: Expansion, lang: Langs): ExpansionSingle {
	return {
		code: expansion.code,
		name: typeof expansion.name === "string" ? expansion.name : expansion.name[lang],
		sets: getAllSets(expansion.code, true).map(el => setToSetSimple(fetchSet(expansion.code, el), lang))
	}
}
