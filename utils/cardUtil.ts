import { getSet, setToSetSimple } from "./setUtil"
import { fetchRemoteFile, smartGlob } from "./util"
import { Set, SupportedLanguages, Card } from 'db/interfaces'
import fetch from 'node-fetch'
import { Card as CardSingle, CardResume } from '@tcgdex/sdk/interfaces'

interface ObjectList<T = any> {
	[key: string]: T
}

type RemoteData = ObjectList<ObjectList<ObjectList<boolean>>>

export async function cardToCardSimple(id: string, card: Card, lang: SupportedLanguages): Promise<CardResume> {
	const cardName = card.name[lang]
	if (!cardName) {
		throw new Error(`Card (${card.set.id}-${id}) has no name in (${lang})`)
	}
	const img = await getCardPictures(id, card, lang)
	return {
		id: `${card.set.id}-${id}`,
		localId: id,
		name: cardName,
		image: img
	}
}

export async function getCardPictures(cardId: string, card: Card, lang: SupportedLanguages): Promise<string | undefined> {
	try {
		const file = await fetchRemoteFile(`https://assets.tcgdex.net/data-${lang}.json`)
		if (file[card.set.serie.id][card.set.id][cardId]) {
			return `https://assets.tcgdex.net/${lang}/${card.set.serie.id}/${card.set.id}/${cardId}`
		}
	} catch {
		return undefined
	}
}

export async function cardToCardSingle(localId: string, card: Card, lang: SupportedLanguages): Promise<CardSingle> {

	const image = await getCardPictures(localId, card, lang)

	if (!card.name[lang]) {
		throw new Error(`Card (${localId}) dont exist in (${lang})`)
	}




	return {
		id: `${card.set.id}-${localId}`,
		localId: localId,
		name: card.name[lang] as string,
		image: image,

		illustrator: card.illustrator,
		rarity: card.rarity, // translate
		category: card.category, // translate
		variants: {
			normal: typeof card.variants?.normal === 'boolean' ? card.variants.normal : typeof card.set.variants?.normal === 'boolean' ? card.set.variants.normal : true,
			reverse: typeof card.variants?.reverse === 'boolean' ? card.variants.reverse : typeof card.set.variants?.reverse === 'boolean' ? card.set.variants.reverse : true,
			holo: typeof card.variants?.holo === 'boolean' ? card.variants.holo : typeof card.set.variants?.holo === 'boolean' ? card.set.variants.holo : true,
			firstEdition: typeof card.variants?.firstEdition === 'boolean' ? card.variants.firstEdition : typeof card.set.variants?.firstEdition === 'boolean' ? card.set.variants.firstEdition : false,
		},

		set: await setToSetSimple(card.set, lang),

		dexId: card.dexId,
		hp: card.hp,
		types: card.types, // translate
		evolveFrom: card.evolveFrom && card.evolveFrom[lang],
		weight: card.weight,
		description: card.description ? card.description[lang] as string : undefined,
		level: card.level,
		stage: card.stage, // translate
		suffix: card.suffix, // translate
		item: card.item ? {
			name: card.item.name[lang] as string,
			effect: card.item.effect[lang] as string
		} : undefined,

		abilities: card.abilities?.map((el) => ({
			type: el.type, // translate
			name: el.name[lang] as string,
			effect: el.effect[lang] as string
		})),

		attacks: card.attacks?.map((el) => ({
			cost: el.cost,
			name: el.name[lang] as string,
			effect: el.effect ? el.effect[lang] : undefined,
			damage: el.damage
		})),

		weaknesses: card.weaknesses?.map((el) => ({
			type: el.type, // translate
			value: el.value
		})),

		resistances: card.resistances?.map((el) => ({
			type: el.type, // translate
			value: el.value
		})),

		retreat: card.retreat,

		effect: card.effect ? card.effect[lang] : undefined,

		trainerType: card.trainerType, // translate
		energyType: card.energyType // translate
	}
}

/**
 *
 * @param setName the setname of the card
 * @param id the local id of the card
 * @returns [the local id, the Card object]
 */
export async function getCard(serie: string, setName: string, id: string): Promise<Card> {
	return (await import(`../db/data/${serie}/${setName}/${id}.js`)).default
}

export async function getCards(set?: Set): Promise<Array<[string, Card]>> {
	const cards = (await smartGlob(`./db/data/${(set && set.serie.name.en) ?? '*'}/${(set && set.name.en) ?? '*'}/*.js`))
	const list: Array<[string, Card]> = []
	for (const path of cards) {
		const id = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
		const setName = (set && set.name.en) ?? (() => {
			const part1 = path.substr(0, path.lastIndexOf(id) - 1)
			return part1.substr(part1.lastIndexOf('/') + 1)
		})()
		const serieName = (set && set.serie.name.en) ?? (() => {
			const part1 = path.substr(0, path.lastIndexOf(setName) - 1)
			return part1.substr(part1.lastIndexOf('/') + 1)
		})()
		console.log(path, id, setName)
		const c = await getCard(serieName, setName, id)
		if (!c.name.en) {
			continue
		}
		list.push([id, c])
	}
	// console.log(list[0], list[0][0])
	// process.exit(0)
	return list
}
