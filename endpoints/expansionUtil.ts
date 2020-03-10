import Expansion from "../db/interfaces/Expansion"
import Set from "../db/interfaces/Set"

export function getExpansion(set: Set): Expansion {
	if ("expansion" in set) return set.expansion
	return require(`../../db/expansions/${set.expansionCode}`)
}
