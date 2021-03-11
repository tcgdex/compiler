import { CardList, Card as CardSingle, StringEndpointList, StringEndpoint } from '@tcgdex/sdk/interfaces'
import { Card, Languages } from '../db/interfaces'
import { Endpoint } from '../interfaces'
import Logger from '@dzeio/logger'
import { cardToCardSimple, cardToCardSingle, getCards } from '../utils/cardUtil'
import { basename } from 'path'

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
			const it = {
				name: key,
				cards: await Promise.all(val.map(([id, card]) => cardToCardSimple(id, card, this.lang)))
			}
			items[key] = it
		}
		return items
	}

	public async common() {
		return (await getCards()).reduce((p, c) => {
			const category = c[1].category
			if (!category) return p
			if (!p[category]) {
				p[category] = []
			}
			p[category].push(c)
			return p
		}, {} as Record<string, Array<[string, Card]>>)
	}
}
