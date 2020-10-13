((elems)=>{

	"use strict";

	if(!elems.length) {

		return;

	}

	Array.from(elems, el => {

		el.addEventListener('click', event => {

			event.preventDefault();

			document.querySelector('#modal-gallery').innerHTML =
				'<img src="' + el.getAttribute('href') + '">';

			const modalShow = new CustomEvent("modalShow", {
				detail : {
					selector : "gallery"
				}
			});

			document.querySelector('.modal').dispatchEvent(modalShow);

		});

	});

})(document.querySelectorAll('.modal-gallery'));