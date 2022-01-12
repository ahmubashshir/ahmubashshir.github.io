import makeBadge from '../node_modules/badge-maker/lib/make-badge.js';
import simpleIcons from 'simple-icons';
import { optimize } from 'svgo';
import badges from './badges.js';
import fs from 'fs';
import path from 'path';
import docker from 'is-docker'
const noop = () => {}
const root = './../'
const dir = path.join(
				root,
				docker()?'public':'static',
				'/assets/badges'
			);

let badgeInfo = {};

const size = (data) => {
	return Math.round((data / 1024) * 1000) / 1000 + ' KiB';
}

const profit = (size, optisize) => {
	return Math.abs(Math.round((100 - (optisize * 100) / size) * 10) / 10);
}

fs.mkdirSync(dir ,{ recursive: true });
fs.readdirSync( dir, ( err, files ) => {
	if ( err ) throw err;
	for ( const file of files ) {
		if ( file.endsWith( '.svg' ) )
			fs.unlink( path.join( dir, file ), () => {} );
	}
} );

badges.forEach(
	( badge, idx, arr ) => {
		let _start = Date.now();
		let _path = path.join( dir, badge.name + '.svg' );
		let logo = simpleIcons.get( badge.icon || badge.name );
		console.log(`${badge.name}:`);

		let badgeData = {
			format: 'svg',
			message: badge.name,
			label: '',
			style: "for-the-badge",
			color: badge.color || logo.color,
			logo: "data:image/svg+xml;base64," + Buffer.from(
				logo.svg.replace( '<svg', '<svg fill="#fff"' ),
				'utf-8'
			).base64Slice()
		}

		let _badge = makeBadge( badgeData );
		let _size = Buffer.byteLength(_badge, 'utf8');
		_badge = optimize(_badge, {
			path: _path,
			multipass: true,
		});
		let _end = Date.now();
		let _optisize = Buffer.byteLength(_badge.data, 'utf8');
		
		fs.writeFile(_path, _badge.data, 'utf8', noop);
		badgeInfo[badge.name] = _badge.info;
		console.log(`  optimize: ${_end - _start}ms`);
		console.log(`    before: ${size(_size)}`)
		console.log(`     after: ${size(_optisize)}`);
		console.log(`     ratio: ${profit(_size, _optisize)}%\n`)

	}
)

fs.mkdirSync(path.join(root, 'data') ,{ recursive: true });
fs.writeFileSync(path.join(root, 'data/badge.json'), JSON.stringify(badgeInfo), 'utf8');