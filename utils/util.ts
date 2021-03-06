import { Card, Set } from 'db/interfaces'
import glob from 'glob'
import fetch from 'node-fetch'
import * as legals from '../db/legals'

export function urlize(str: string): string {
	return str
		.replace('?', '%3F')
		.normalize('NFC')
		// eslint-disable-next-line no-misleading-character-class
		.replace(/["'\u0300-\u036f]/gu, '')
}

interface fileCacheInterface {
	[key: string]: any
}

const fileCache: fileCacheInterface = {}

export async function fetchRemoteFile<T = any>(url: string): Promise<T> {
	if (!fileCache[url]) {
		const resp = await fetch(url, {
			timeout: 60 * 1000
		})
		fileCache[url] = resp.json()
	}
	return fileCache[url]
}

const globCache: Record<string, Array<string>> = {}

export async function smartGlob(query: string): Promise<Array<string>> {
	if (!globCache[query]) {
		globCache[query] = await new Promise((res) => {
			glob(query, (err, matches) => res(matches))
		})
	}
	return globCache[query]
}

export function cardIsLegal(type: 'standard' | 'expanded', card: Card, localId: string): boolean {
	const legal = legals[type]
	if (
		legal.includes.series.includes(card.set.serie.id) ||
		legal.includes.sets.includes(card.set.id) ||
		card.regulationMark && legal.includes.regulationMark.includes(card.regulationMark)
	) {
		return !(
			legal.excludes.sets.includes(card.set.id) ||
			legal.excludes.cards.includes(`${card.set.id}-${localId}`)
		)
	}
	return false
}

export function setIsLegal(type: 'standard' | 'expanded', set: Set): boolean {
	const legal = legals[type]
	if (
		legal.includes.series.includes(set.serie.id) ||
		legal.includes.sets.includes(set.id)
	) {
		return !legal.excludes.sets.includes(set.id)
	}
	return false
}
