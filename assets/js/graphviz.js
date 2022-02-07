var viz = new Viz();
( function () {
	const forEach = ( list, callback ) => {
		Array.prototype.forEach.call( list, callback );
	};
	forEach( document.querySelectorAll( "[data-diagram]" ), code => {

		let parent = code.parentNode;
		let engine = code.getAttribute( "data-diagram" ) || "dot";
		let image;

		viz.renderSVGElement( code.innerText )
			.then( image => {
				let bg = image.querySelector( 'polygon[fill]' );
				bg.setAttribute( 'fill', 'transparent' );

				forEach( image.querySelectorAll( '[fill="#000000"]' ), fill => {
					fill.removeAttribute( 'fill' );
					fill.style.fill = 'var(--content)';
				} )

				forEach( image.querySelectorAll( '[stroke="#000000"]' ), stroke => {
					stroke.removeAttribute( 'stroke' );
					stroke.style.stroke = 'var(--content)';
				} )
				parent.insertBefore( image, code );
			} )
			.catch( error => {
				viz = new Viz();
				let err = document.createElement( 'p' );
				err.style.backgroundColor = 'red';
				err.style.fontWeight = "bold";
				err.textContent = error;
				parent.insertBefore( err, code );
				console.error( error );
			} )
			.finally( () => {
				code.style.display = 'none';
				parent.scrollLeft = parent.scrollLeftMax / 2;
			} )
	} );
} )();
