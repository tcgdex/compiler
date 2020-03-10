import Expansion from "../db/interfaces/Expansion"
import Set from "../db/interfaces/Set"
import * as glob from 'glob'
import { Langs } from "../db/interfaces/LangList"

export function getExpansion(set: Set): Expansion {
	if ("expansion" in set) return set.expansion
	return require(`../../db/expansions/${set.expansionCode}`)
}

export function getAllExpansions(): Array<string> {
	return glob.sync("./db/expansions/*.ts").map(el => el.substr(16, el.length-15-1-3)) // -15 = start -1 = 0 index -3 = .ts
}

export function expansionToExpansionSimple(expansion: Expansion, lang: Langs) {
	return {
		code: expansion.code,
		name: typeof expansion.name === "string" ? expansion.name : expansion.name[lang]
	}
}
