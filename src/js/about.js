((about) => {

	if (about) {

		const ancor = document.querySelectorAll('.about__body [id]'),
			  bar = document.querySelectorAll('.about__bar a');

		window.addEventListener("scroll", () => window.requestAnimationFrame( () => {

			let id = ancor[0].getAttribute('id');

			Array.from(ancor, h2 => {

				if(h2.getBoundingClientRect().top < 24){

					id = h2.getAttribute('id');

				}

			});

			id = '#' + id;

			Array.from(bar, a => a.classList.toggle('is-active', a.getAttribute('href') === id));

		}));

	}

})(document.querySelector('.about'));