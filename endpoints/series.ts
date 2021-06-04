import { Serie as SerieSingle, SerieList } from '@tcgdex/sdk/interfaces'
import { Languages, Serie } from '../db/interfaces'
import { Endpoint } from '../interfaces'
import { getSeries, serieToSerieSimple, serieToSerieSingle } from '../utils/serieUtil'

export default class implements Endpoint<SerieList, SerieSingle, {}, Array<Serie>> {
	public constructor(
		private lang: keyof Languages
	) {}

	public async index(common: Array<Serie>) {
		return Promise.all(common.map((s) => serieToSerieSimple(s, this.lang)))
	}

	public async item(common: Array<Serie>) {
		const items: Record<string, SerieSingle> = {}
		for (let key = 0; key < common.length; key++) {
			const val = common[key];
			const gen = await serieToSerieSingle(val, this.lang)
			const name = val.name[this.lang]
			items[name] = gen
			items[val.id] = gen
		}
		return items
	}

	public async common() {
		return getSeries(this.lang)
	}
}
