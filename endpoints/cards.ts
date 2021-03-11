import { CardList, Card as CardSingle } from '@tcgdex/sdk/interfaces'
import { Card, Languages } from '../db/interfaces'
import { Endpoint } from '../interfaces'
import Logger from '@dzeio/logger'
import { cardToCardSimple, cardToCardSingle, getCards } from '../utils/cardUtil'
import { basename } from 'path'

const logger = new Logger(basename(__filename))

export default class implements Endpoint<CardList, CardSingle, {}, Array<[string, Card]>> {
	public constructor(
		private lang: keyof Languages
	) {}

	public async index(common: Array<[string, Card]>) {
		return Promise.all(common.map((c) => cardToCardSimple(c[0], c[1], this.lang)))
	}

	public async item(common: Array<[string, Card]>) {
		const items: Record<string, CardSingle> = {}
		for (const card of common) {
			items[`${card[1].set.id}-${card[0]}`] = await cardToCardSingle(card[0], card[1], this.lang)
		}
		return items
	}

	public async common() {
		return getCards()
	}
}
