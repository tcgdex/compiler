import Set from "@tcgdex/sdk/interfaces/Set"
import Card from "@tcgdex/sdk/interfaces/Card"
import * as glob from 'glob'
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { SetSimple, SetSingle } from "@tcgdex/sdk/interfaces/Set"
import { cardToCardSimple } from "./cardUtil"
import { CardSimple } from "@tcgdex/sdk/interfaces/Card"
import { getAllCards, getAllCards2, smartGlob } from "./util"

interface t<T = Set> {
	[key: string]: T
}

const setCache: t = {}

export function isSet(set: Set | {name: string, code: string}): set is Set {
	return "releaseDate" in set
}

export async function getSet(card: Card): Promise<Set> {
	if (!(card.set.code in setCache)) {
		if (isSet(card.set)) setCache[card.set.code] = card.set
		let setPath = (await smartGlob(`./db/sets/**/${card.set.code}.js`))[0]
		setPath = setPath.replace('./', '../')
		setCache[card.set.code] = require(setPath).default
	}
	return setCache[card.set.code]
}

export async function fetchSet(expansion: string, set: string): Promise<Set> {
	return (await import(`../db/sets/${expansion}/${set}.js`)).default
}

export function isSetAvailable(set: Set, lang: Langs) {
	if (!set.availability || !(lang in set.availability)) return true
	return set.availability
}

export function setToSetSimple(set: Set, lang: Langs): SetSimple {
	return {
		code: set.code,
		logo: set.images && set.images.logo,
		symbol: set.images && set.images.symbol,
		name: typeof set.name === "string" ? set.name : set.name[lang],
		total: set.cardCount.total
	}
}

export async function getSetCards(set: Set, lang: Langs): Promise<Array<CardSimple>> {
	const cardes = await getAllCards(set.code, set.expansionCode ?? set.expansion.code)
	const cards: Array<Card> = []
	for (let el of cardes) {
		el = el.replace("../../", "../")
		const card: Card = (await import(el)).default

		cards.push(
			card
		)
	}
	return await Promise.all(cards.sort((a, b) => {
		if (
			!isNaN(parseInt(a.localId + "")) &&
			!isNaN(parseInt(b.localId + ""))
		) {
			return parseInt(a.localId + "") - parseInt(b.localId + "")
		}
		return a.localId > b.localId ? 1 : -1
	}).map(el => cardToCardSimple(el, lang)))
}

export async function setToSetSingle(set: Set, lang: Langs): Promise<SetSingle> {
	return {
		name: set.name[lang],
		code: set.code,
		expansionCode: set.expansion && set.expansion.code || set.expansionCode || undefined,
		tcgoCode: set.tcgoCode,
		cardCount: {
			total: set.cardCount.total,
			official: set.cardCount.official
		},
		releaseDate: set.releaseDate,
		legal: set.legal && {
			standard: set.legal.standard,
			expanded: set.legal.expanded
		},
		images: set.images && {
			symbol: set.images.symbol,
			logo: set.images.logo
		},
		list: await getSetCards(set, lang)
	}
}
