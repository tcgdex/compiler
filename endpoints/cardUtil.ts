import Card, { CardSimple, CardSingle } from "@tcgdex/sdk/interfaces/Card";
import { Langs } from "@tcgdex/sdk/interfaces/LangList";
import { typeToTypeSimple } from "./typeUtil";
import { rarityToRaritySimple } from "./RarityUtil";
import { tagToTagSimple } from "./TagUtil";
import Category from "@tcgdex/sdk/interfaces/Category";
import { attackToAttackSingle } from "./attackUtil";
import { abilityToAbilitySingle } from "./abilityUtil";
import { getExpansion, getExpansionFromSetName } from "./expansionUtil";
import { getSet } from "./setUtil";
import Expansion from "@tcgdex/sdk/interfaces/Expansion";
import { fetchIllustratorsSync } from "./illustratorUtil";
import TranslationUtil from "@tcgdex/sdk/TranslationUtil";
import { fetchRemoteFile } from "./util";

interface ObjectList<T = any> {
	[key: string]: T
}

type RemoteData = ObjectList<ObjectList<ObjectList<boolean>>>

export async function cardToCardSimple(card: Card, lang: Langs): Promise<CardSimple> {
	let image: string = undefined
	const file: RemoteData = await fetchRemoteFile(`https://assets.tcgdex.net/data-${lang}.json`)
	const expansion = getExpansionFromSetName(card.set.code)
	if (file[expansion.code] && file[expansion.code][card.set.code] && file[expansion.code][card.set.code][card.localId]) {
		const basePath = `https://assets.tcgdex.net/${lang}/${expansion.code}/${card.set.code}/${card.localId}`
		image = `${basePath}/low`
	}

	return {
		id: card.id,
		localId: card.localId,
		name: card.name[lang],
		image
	}
}

export function getCardExpansion(card: Card): Expansion {
	return getExpansion(getSet(card))
}

export async function cardToCardSingle(card: Card, lang: Langs): Promise<CardSingle> {

	let images: {
		low: string;
		high?: string;
	} = undefined

	const file: RemoteData = await fetchRemoteFile(`https://assets.tcgdex.net/data-${lang}.json`)
	const expansion = getExpansionFromSetName(card.set.code)
	if (file[expansion.code] && file[expansion.code][card.set.code] && file[expansion.code][card.set.code][card.localId]) {
		const basePath = `https://assets.tcgdex.net/${lang}/${expansion.code}/${card.set.code}/${card.localId}`
		images = {
			low: `${basePath}/low`,
			high: `${basePath}/high`
		}
	}

	return {
		id: card.id,
		localId: card.localId,
		dexId: card.dexId,

		name: card.name[lang],
		hp: card.hp,
		type: card.type && card.type.map((el) => typeToTypeSimple(el, lang)),

		image: images,

		evolveFrom: card.evolveFrom && card.evolveFrom[lang],
		evolveTo: card.evolveTo && card.evolveTo.map((el) => el[lang]),
		tags: card.tags.map((el) => tagToTagSimple(el, lang)),
		illustrator: card.illustrator && {
			id: fetchIllustratorsSync().indexOf(card.illustrator),
			name: card.illustrator,
		},

		abilities: card.abilities && card.abilities.map((el) => abilityToAbilitySingle(el, lang)),

		attacks: card.attacks && card.attacks.map(el => attackToAttackSingle(el, lang)),

		effect: card.effect && card.effect[lang],

		weaknesses: card.weaknesses && card.weaknesses.map(el => {return {type: typeToTypeSimple(el.type, lang), value: el.value}}),
		resistances: card.resistances && card.resistances.map(el => {return {type: typeToTypeSimple(el.type, lang), value: el.value}}),

		retreat: card.retreat && card.retreat,

		rarity: rarityToRaritySimple(card.rarity, lang),

		category: {
			id: card.category,
			name: TranslationUtil.translate("category", card.category, lang)
		},

		set: {
			name: typeof card.set.name === "object" ? card.set.name[lang] : card.set.name,
			code: card.set.code
		},
	}
}

export function isCardAvailable(card: Card, lang: Langs): boolean {
	if (!(lang in card.name)) return false
	const set = getSet(card)
	if ("availability" in set && (lang in set.availability)) {
		return set.availability[lang]
	}
	return true
}

export function fetchCard(card: string, set?: string, expansion?: string): Card {
	return require(`../db/cards/${expansion && (expansion + "/") || ""}${set && (set + "/") || ""}${card}`).default
}

export async function fetchCardAsync(card: string, set?: string, expansion?: string): Promise<Card> {
	return (await import(`../db/cards/${expansion && (expansion + "/") || ""}${set && (set + "/") || ""}${card}`)).default
}
