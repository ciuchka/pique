function PageTransitions (type) {
	var pages = $( '#pt-main' ).children( 'div.pt-page' ),
	iterate = $( '#iterateEffects' ),
	animcursor = 1,
	pagesCount = pages.length,
	current = 0,
	isAnimating = false,
	endCurrPage = false,
	endNextPage = false,
	animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
	animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
	support = Modernizr.cssanimations;
	
	function init() {
		pages.each( function() {
			var page = $( this );
			page.data( 'originalClassList', page.attr( 'class' ) );
		} );

		pages.eq( current ).addClass( 'pt-page-current' );			
	}

	function nextPage(increment) 
	{

		if( isAnimating ) {
			return false;
		}

		isAnimating = true;
		
		var currPage = pages.eq( current );
		current += increment;

		if (current < 0)
		{
			current = pagesCount - 1;
		}
		else if (current > pagesCount - 1)	
		{
			current = 0;
		}
		
		
		var nextPage = pages.eq( current ).addClass( 'pt-page-current' ),
			outClass = 'pt-page-moveToLeft',
			inClass = 'pt-page-moveFromRight';
		
		if (increment < 0 )
		{
		outClass = 'pt-page-moveToRight pt-page-ontop',
		inClass = 'pt-page-moveFromLeft';
		}
		currPage.css('visibility','hidden');
		nextPage.css('visibility','visible');
		currPage.addClass( outClass ).on( animEndEventName, function() {
			currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( currPage, nextPage );
			}
		} );

		nextPage.addClass( inClass ).on( animEndEventName, function() {
			nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( currPage, nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( currPage, nextPage );
		}

	}

	function onEndAnimation( outpage, inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( outpage, inpage );		
		isAnimating = false;
	}

	function resetPage( outpage, inpage ) {
		outpage.attr( 'class', outpage.data( 'originalClassList' ) );
		inpage.attr( 'class', inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}

	init();

	return { 
		init : init,
		nextPage : nextPage,
	};

}
$(document).ready(function()
{
var x = new PageTransitions();
$("a.button.left").on("click", function()
		{ 		
		x.nextPage(-1);
		});
$("a.button.right").on("click", function()
		{ 		
		x.nextPage(1);
		});
});