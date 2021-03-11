import { StringEndpointList, StringEndpoint } from '@tcgdex/sdk/interfaces'
import { getSet, getSets, isSetAvailable, setToSetSimple, setToSetSingle } from "../utils/setUtil"
import { Card, Languages, Set } from '../db/interfaces'
import { Endpoint } from '../interfaces'
import Logger from '@dzeio/logger'
import { cardToCardSimple, cardToCardSingle, getCards } from '../utils/cardUtil'
import { basename } from 'path'
import { objectLoop } from '@dzeio/object-util'

const logger = new Logger(basename(__filename))

export default class implements Endpoint<StringEndpointList, StringEndpoint, {}, Record<string, Array<[string, Card]>>> {
	public constructor(
		private lang: keyof Languages
	) {}

	public async index(common: Record<string, Array<[string, Card]>>) {
		return Object.keys(common)
	}

	public async item(common: Record<string, Array<[string, Card]>>) {
		const items: Record<string, StringEndpoint> = {}
		for (const key of Object.keys(common)) {
			const val = common[key]
			items[key] = {
				name: key,
				cards: await Promise.all(val.map(([id, card]) => cardToCardSimple(id, card, this.lang)))
			}
		}
		return items
	}

	public async common() {
		return (await getCards()).reduce((p, c) => {
			const rarity = c[1].rarity // TODO: translate using this.lang
			if (!rarity) return p
			if (!p[rarity]) {
				p[rarity] = []
			}
			p[rarity].push(c)
			return p
		}, {} as Record<string, Array<[string, Card]>>)
	}
}
