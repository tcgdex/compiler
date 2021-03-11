import { config } from 'dotenv'
import path from 'path'
import { ConnectConfig } from 'ssh2'
import SFTPPromise from './SFTPPromise'

config()

const sshConfig: ConnectConfig = {
	host: process.env.UPLOAD_REMOTE,
	username: process.env.UPLOAD_USERNAME,
	password: process.env.UPLOAD_PASSWORD ,
	port: 22
};

async function main() {
}

main().then(msg => {
	console.log(msg);
}).catch(err => {
	console.log(`main error: ${err.message}`);
});

;(async () => {
	const client = new SFTPPromise(sshConfig)
	// client.debug = true
	await client.connect()
	const src = `${__dirname}/dist`
	const dst = process.env.UPLOAD_DIST as string
	await client.uploadDir(src, dst, /\.git/g)
	process.exit(0)
})()
