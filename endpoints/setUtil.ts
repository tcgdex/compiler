import Set from "@tcgdex/sdk/interfaces/Set"
import Card from "@tcgdex/sdk/interfaces/Card"
import * as glob from 'glob'
import { Langs } from "@tcgdex/sdk/interfaces/LangList"
import { SetSimple, SetSingle } from "@tcgdex/sdk/interfaces/Set"
import { cardToCardSimple } from "./cardUtil"
import { CardSimple } from "@tcgdex/sdk/interfaces/Card"
import { getAllCards2 } from "./util"

interface t<T = Set> {
	[key: string]: T
}

const setCache: t = {}

export function isSet(set: Set | {name: string, code: string}): set is Set {
	return "releaseDate" in set
}

export function getSet(card: Card): Set {
	if (!(card.set.code in setCache)) {
		if (isSet(card.set)) setCache[card.set.code] = card.set
		let setPath = glob.sync(`./db/sets/**/${card.set.code}.js`)[0]
		setPath = setPath.replace('./', '../')
		setCache[card.set.code] = require(setPath).default
	}
	return setCache[card.set.code]
}

export function fetchSet(expansion: string, set: string): Set {
	return require(`../db/sets/${expansion}/${set}.js`).default
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

export function getSetCards(set: Set, lang: Langs): Array<CardSimple> {
	const cardes = getAllCards2(set.code)
	const cards: Array<Card> = []
	for (let el of cardes) {
		el = el.replace("./", "../")
		const card: Card = require(el).default

		cards.push(
			card
		)
	}

	return cards.sort((a, b) => {
		if (!isNaN(parseInt(a.localId + "")) && !isNaN(parseInt(b.localId + ""))) {
			return parseInt(a.localId + "") - parseInt(b.localId + "")
		}
		return a.localId > b.localId ? 1 : -1
	}).map(el => cardToCardSimple(el, lang))
}

export function setToSetSingle(set: Set, lang: Langs): SetSingle {
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
		list: getSetCards(set, lang)
	}
}
