import { promises as fs, promises } from 'fs'
import * as glob from 'glob'

const VERSION = 'v1'

export function getAllCards(set = "**", expansion = "**") {
	return glob.sync(`./db/cards/${expansion}/${set}/*.js`).map(el => {
		return el.substr(11, el.length-10-1-3)
	})
}

export function getAllCards2(set = "**", expansion = "**") {
	return glob.sync(`./db/cards/${expansion}/${set}/*.js`)
}

export function getAllSets(expansion = "**", nameOnly = false) {
	if (nameOnly) return glob.sync(`./db/sets/${expansion}/*.js`).map(el => el.substr(11+expansion.length, el.length-(10+expansion.length)-1-3))
	return glob.sync(`./db/sets/${expansion}/*.js`)
}

export function getAllCardsJSON() {
	return glob.sync("./db/cards/**/**/*.json")
}

async function listFolder(folder: string): Promise<Array<string>> {
	const files = await fs.readdir(folder)
	const res = []
	for (const file of files) {
		if (file.endsWith(".json")) res.push(`${folder}/${file}`)
		if ((await fs.stat(`${folder}/${file}`)).isDirectory()) {
			res.push(...await listFolder(`${folder}/${file}`))
		}
	}
	return res
}

export function getBaseFolder(lang: string, endpoint: string) {
	return `./dist/${VERSION}/${lang}/${endpoint}`
}

export async function del(path: string) {
	let files = []
	const promiseArr = []
	try {
		files = await promises.readdir(path)
	} catch {
		return
	}
	if (files.length > 0) {
		for (const file of files) {
			const fPath = `${path}/${file}`
			if ((await promises.stat(fPath)).isDirectory()) {
				promiseArr.push(
					del(fPath)
				)
			} else {
				promiseArr.push(
					promises.unlink(fPath)
				)
			}
		}
	}
	await Promise.all(promiseArr)
	await promises.rmdir(path)
}

export function urlize(str: string): string {
	str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
	return str.replace(/ /g, "-").toLowerCase()
}
