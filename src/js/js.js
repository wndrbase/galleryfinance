/*! UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

https://github.com/htmlpluscss/

*/

(()=>{

	"use strict";

	window.GF = window.GF || {};
	GF.resizeTimeout = null;
	GF.windowWidthOLd = window.innerWidth;

	window.addEventListener("resize",()=>{

		window.requestAnimationFrame(()=>{

			if (!GF.resizeTimeout) {

				GF.resizeTimeout = setTimeout(()=>{

					GF.resizeTimeout = null;

					if(GF.windowWidthOLd !== window.innerWidth) {

						GF.windowWidthOLd = window.innerWidth;

						PubSub.publish('windowWidthResize');

					}

				}, 100);

			}

		});

	});

})();