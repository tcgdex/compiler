import { StringEndpointList, StringEndpoint } from '@tcgdex/sdk/interfaces'
import { Card, Languages } from '../db/interfaces'
import { Endpoint } from '../interfaces'
import { cardToCardSimple, getCards } from '../utils/cardUtil'

export default class implements Endpoint<StringEndpointList, StringEndpoint, Record<string, unknown>, Record<string, Array<[string, Card]>>> {

	public constructor(
		private lang: keyof Languages
	) {}

	public async index(common: Record<string, Array<[string, Card]>>): Promise<StringEndpointList> {
		return Object.keys(common)
	}

	public async item(common: Record<string, Array<[string, Card]>>): Promise<Record<string, StringEndpoint>> {
		const items: Record<string, StringEndpoint> = {}
		for await (const key of Object.keys(common)) {
			const val = common[key]
			items[key] = {
				cards: await Promise.all(val.map(([id, card]) => cardToCardSimple(id, card, this.lang))),
				name: key
			}
		}
		return items
	}

	public async common(): Promise<Record<string, Array<[string, Card]>>> {
		return (await getCards(this.lang)).reduce((p, c) => {
			const { illustrator } = c[1]
			if (!illustrator) {
				return p
			}
			if (!p[illustrator]) {
				p[illustrator] = []
			}
			p[illustrator].push(c)
			return p
		}, {} as Record<string, Array<[string, Card]>>)
	}

}
