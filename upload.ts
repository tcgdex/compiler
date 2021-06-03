import { config } from 'dotenv'
import { ConnectConfig } from 'ssh2'
import SFTPPromise from './SFTPPromise'

config()

const sshConfig: ConnectConfig = {
	host: process.env.UPLOAD_REMOTE,
	password: process.env.UPLOAD_PASSWORD,
	port: 22,
	username: process.env.UPLOAD_USERNAME
}

;(async () => {
	const client = new SFTPPromise(sshConfig)
	// client.debug = true
	await client.connect()
	const src = `${__dirname}/dist`
	const dst = process.env.UPLOAD_DIST as string
	await client.uploadDir(src, dst, /\.git/gu)
	process.exit(0)
})()
