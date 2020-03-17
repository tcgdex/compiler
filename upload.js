'use strict';

// Example of using the uploadDir() method to upload a directory
// to a remote SFTP server

const path = require('path');
const SftpClient = require('ssh2-sftp-client');

const config = {
	host: process.env.UPLOAD_REMOTE,
	username: process.env.UPLOAD_USERNAME,
	password: process.env.UPLOAD_PASSWORD ,
	port: 22
};

async function main() {
	const client = new SftpClient();
	const src = path.join(__dirname, 'dist');
	const dst = process.env.UPLOAD_DIST;

	try {
		await client.connect(config);
		client.on('upload', info => {
			console.log(`${info.source} => ${info.destination}`);
		});
		let rslt = await client.uploadDir(src, dst);
		return rslt;
	} finally {
		client.end();
	}
}

main().then(msg => {
	console.log(msg);
}).catch(err => {
	console.log(`main error: ${err.message}`);
});
