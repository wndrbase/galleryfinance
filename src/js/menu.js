
	document.querySelector('.btn-menu-toggle').addEventListener('click', () =>
		document.body.classList.toggle('menu-show'));

	document.querySelector('.menu').addEventListener('click', event => {

		if(event.target.closest('.menu__link')){

			document.body.classList.remove('menu-show');

		}

	});