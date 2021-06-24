const makeBadge = require( './node_modules/badge-maker/lib/make-badge' );
const simpleIcons = require( 'simple-icons' );
const badges = require( './_data/badges' );
const fs = require( 'fs' );
const path = require( 'path' );
const dir = './assets/badges'
fs.readdirSync( dir, ( err, files ) => {
	if ( err ) throw err;
	for ( const file of files ) {
		if ( file.endsWith( '.svg' ) )
			fs.unlink( path.join( dir, file ), () => {} );
	}
} );

badges.forEach(
	( badge, idx, arr ) => {
		let logo = simpleIcons.get( badge.icon || badge.name ) || badge.icon;
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
		console.info( "badge: " + badge.name)
		fs.writeFile(
			path.join( dir, badge.name + '.svg' ),
			_badge,
			'utf8',
			() => {}
		);
	}
)
