import * as glob from 'glob'
import fetch from 'node-fetch'

const VERSION = 'v1'

export async function getAllCards(set = "**", expansion = "**") {
	return (await smartGlob(`./db/cards/${expansion}/${set}/*.js`)).map((it) => it.replace('./', '../../'))
}

export function getAllCards2(set = "**", expansion = "**") {
	return glob.sync(`./db/cards/${expansion}/${set}/*.js`)
}

export async function getAllSets(expansion = "**") {
	return (await smartGlob(`./db/sets/${expansion}/*.js`))
		.map(el => el.substring(el.lastIndexOf('/') + 1, el.lastIndexOf('.')))
}

export function getBaseFolder(lang: string, endpoint: string) {
	return `./dist/${VERSION}/${lang}/${endpoint}`
}

export function urlize(str: string): string {
	str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
	return str.replace(/ /g, "-").toLowerCase()
}

interface fileCacheInterface {
	[key: string]: any
}
const fileCache: fileCacheInterface = {}

export async function fetchRemoteFile<T = any>(url: string): Promise<T> {
	// console.log(Object.keys(fileCache))
	if (!fileCache[url]) {
		const resp = await fetch(url)
		// console.log(await resp.text(), url)
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
