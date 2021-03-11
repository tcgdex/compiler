import { ConnectConfig, Client, SFTPWrapper } from "ssh2";
import { Stats, InputAttributes } from 'ssh2-streams'
import { promises as fs } from 'fs'
import { posix as pathJS } from 'path'
import Queue from '@dzeio/queue'
import Logger from '@dzeio/logger'
const logger = new Logger('SFTPPromise')
export default class SFTPPromise {

	private sftp?: SFTPWrapper
	private conn: Client = new Client()
	public debug = false
	public tmpFolder?: string

	public constructor(public config: ConnectConfig) {}

	public connect() {
		return new Promise<void>((res, rej) => {
			this.conn.on('ready', () => {
				this.conn.sftp((err, sftpLocal) => {
					this.sftp = sftpLocal
					res()
				})
			}).connect(this.config)
		})
	}

	public async makeTemporaryFolder() {
		this.l('Making temporary Folder')
		this.tmpFolder = await fs.mkdtemp('tcgdex-generator')
	}

	public stat(path: string): Promise<Stats> {
		const sftp = this.getSFTP()
		return new Promise((res, rej) => {
			sftp.stat(path, (err, stats) => {
				if (err) {
					rej(err)
				}
				res(stats)
			})
		})
	}

	public async exists(path: string): Promise<boolean> {
		try {
			await this.stat(path)
			return true
		} catch {
			return false
		}
	}

	public async mkdir(path: string, recursive = false, attributes?: InputAttributes, ) {
		this.l('Creating remote folder', path)
		if (recursive) {
			this.l('Making temporary Folder')
			const folders = path.split('/')
			let current = ''
			for (const item of folders) {
				current += '/' + item
				if (!(await this.exists(current))) {
					await this.mkdir(current)
				}
			}
			return
		}
		if (await this.exists(path)) {
			return
		}
		const sftp = this.getSFTP()
		return new Promise<void>((res, rej) => {
			const result = (err?: any) => {
				if (err) {
					rej(err)
				}
				res()
			}
			if (attributes) {
				sftp.mkdir(path, attributes, result)
			} else {
				sftp.mkdir(path, result)
			}

		})
	}

	public async upload(localFile: Buffer|string, path: string) {
		const sftp = this.getSFTP()
		if (typeof localFile !== 'string') {
			if (!this.tmpFolder) {
				await this.makeTemporaryFolder()
			}
			const tmpFile = pathJS.join(this.tmpFolder as string, Math.random().toString().replace('.', ''))
			// this.l('Writing to temporary Folder')
			await fs.writeFile(tmpFile, localFile)
			localFile = tmpFile
		}
		const remoteFolder = pathJS.dirname(path).replace(/\\/g, '/')
		if (!(await this.exists(remoteFolder))) {
			await this.mkdir(remoteFolder, true)
		}
		return new Promise<void>((result, rej) => {
			this.l('Sending file', path)
			sftp.fastPut(localFile as string, path, {
				concurrency: 1,
				step: (uploaded, u, total) => {
					this.l(path.substr(path.lastIndexOf('/')), Math.round(uploaded*100/total),'%', '/', 100, '%')
				}
			}, (err) => {
				if (err) {
					this.l('Error fastPutting file', localFile, 'to', path)
					rej(err)
				}
				this.l('Done')
				result()
				return
			})
		})
	}

	private queue = new Queue(50, 10)
	private filesToUpload = 0
	private filesUploaded = 0

	public async listDir(path: string, exclude?: RegExp): Promise<Array<string>> {
		const files = await fs.readdir(path)
		logger.log('Reading', path)
		let res: Array<string> = []
		for (const file of files) {
			if (exclude?.test(file)) {continue}
			const filePath = `${path}/${file}`
			const stat = await fs.stat(filePath)
			if (stat.isDirectory()) {
				res = res.concat(await this.listDir(filePath))
			} else {
				res.push(filePath)
			}
		}
		return res
	}

	private lastTimeDiff: Array<number> = [
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 50
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 100
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 150
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 200
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 250
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 300
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 50
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 100
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 150
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 200
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 250
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 300
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 50
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 100
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 150
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 200
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 250
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 300
	]
	public async uploadDir(localPath: string, remotePath: string, exclude?: RegExp, root = true) {
		if (root) {
			this.filesToUpload = 0
			this.filesUploaded = 0
		}
		logger.log('Listing files...')
		const files = await this.listDir(localPath, exclude)
		console.log(files)
		logger.log('Running !')
		this.filesToUpload += files.length
		this.queue.start()
		for (const file of files) {
			// console.log('t1')
			if (exclude?.test(file)) {continue}
			// console.log('t1')
			const filePath = file
			const remoteFilePath = `${remotePath}/${file.replace(localPath, '')}`
			// console.log('t1')
			const now = new Date().getTime()
			await this.queue.add(
				this.upload(filePath, remoteFilePath).then(() => {
					this.filesUploaded++
					this.lastTimeDiff.push(new Date().getTime() - now)
					this.lastTimeDiff.shift()
					const time = ((this.filesToUpload-this.filesUploaded)*(this.lastTimeDiff.reduce((p, c) => p + c, 0)/this.lastTimeDiff.length)/10000)
					console.log(`Files uploaded ${(this.filesUploaded * 100 / this.filesToUpload).toFixed(0)}% ${time > 60 ? `${(time/60).toFixed(0)}m` : `${time.toFixed(0)}s`} ${this.filesUploaded}/${this.filesToUpload}`)
				}).catch((err) => logger.log(err, 'Error uploading', filePath, 'to', remoteFilePath))
			)
		}
		if (root) {
			await this.queue.waitEnd()
			console.log('DONE !')
		}
	}

	private getSFTP(): SFTPWrapper {
		if (!this.sftp) {
			throw new Error('please use SFTPPromise.connect() before')
		}
		return this.sftp
	}

	private l(...messages: Array<any>) {
		if (this.debug) {
			logger.log(...messages)
		}
	}
}
