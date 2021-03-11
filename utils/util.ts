import glob from 'glob'
import fetch from 'node-fetch'

export function urlize(str: string): string {
	return str.replace('?', '%3F').normalize('NFD').replace(/["'\u0300-\u036f]/g, "")
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

export async function smartGlob(query: string) {
	if (!globCache[query]) {
		globCache[query] = await new Promise((res) => glob(query, (err, matches) => res(matches)))
	}
	return globCache[query]
}
