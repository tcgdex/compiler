import { Serie as SerieSingle, SerieList, SerieResume } from '@tcgdex/sdk/interfaces'
import { Languages, Serie } from '../db/interfaces'
import { Endpoint } from '../interfaces'
import { getSeries, serieToSerieSimple, serieToSerieSingle } from '../utils/serieUtil'

export default class implements Endpoint<SerieList, SerieSingle, Record<string, any>, Array<Serie>> {

	public constructor(
		private lang: keyof Languages
	) {}

	public async index(common: Array<Serie>): Promise<Array<SerieResume>> {
		return Promise.all(common.map((s) => serieToSerieSimple(s, this.lang)))
	}

	public async item(common: Array<Serie>): Promise<Record<string, SerieSingle>> {
		const items: Record<string, SerieSingle> = {}
		for await (const val of common) {
			const gen = await serieToSerieSingle(val, this.lang)
			const name = val.name[this.lang] as string
			items[name] = gen
			items[val.id] = gen
		}
		return items
	}

	public async common(): Promise<Array<Serie>> {
		return getSeries(this.lang)
	}

}
