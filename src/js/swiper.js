((swiperContainer)=>{

	"use strict";

	if(!swiperContainer.length) {

		return;

	}

	var swiperInit = window.Swiper;

	Array.prototype.forEach.call(swiperContainer, swipe=>{

		var mySwipe = null,
			toggleSwipe = null,
			resetSwipe = null,
			swipeControls = document.createElement('div'),
			swipeNav = document.createElement('div'),
			swipeBtns = document.createElement('div'),
			swipeNext = document.createElement('button'),
			swipePrev = document.createElement('button'),
			items = swipe.querySelectorAll('.swiper-slide'),
			count = items.length,
			review = swipe.classList.contains('swiper-container--review');

		swipeNav.className = 'swiper-pagination';
		swipeControls.className = 'swiper-controls';

		swipeBtns.className = 'swiper-navigation';
		swipePrev.className = 'swiper-button-prev button';
		swipeNext.className = 'swiper-button-next button';

		swipePrev.innerHTML = '<svg width="26" height="24" viewBox="0 0 26 24"><path d="M17.46 24l8.318-12.063L17.46 0h-3.174l7.174 10.667H0v2.603h21.46L14.286 24z"/></svg>';
		swipeNext.innerHTML = '<svg width="26" height="24" viewBox="0 0 26 24"><path d="M17.46 24l8.318-12.063L17.46 0h-3.174l7.174 10.667H0v2.603h21.46L14.286 24z"/></svg>';

		swipeBtns.appendChild(swipePrev);
		swipeBtns.appendChild(swipeNext);
		swipeControls.appendChild(swipeBtns);
		swipeControls.appendChild(swipeNav);
		swipe.parentNode.appendChild(swipeControls);

		resetSwipe = () => {

			if(mySwipe) {

				mySwipe.destroy(false,true);
				mySwipe = undefined;

			}

			swipeNav.classList.add('hide');
			swipeControls.classList.add('hide');

		}

		resetSwipe();

		if (review) {

			toggleSwipe = () =>  {

				resetSwipe();

				if (window.innerWidth < 720) {

					mySwipe = new Swiper(swipe, {
						loop: true,
						autoHeight: true
					});

				}
				else {

					mySwipe = new Swiper(swipe, {
						slidesPerView: 'auto',
						on: {
							imagesReady: () => {

								swipe.classList.toggle('swiper-container--off', swipe.swiper.virtualSize === swipe.swiper.width);

							},
							resize: () => {

								swipe.classList.toggle('swiper-container--off', swipe.swiper.virtualSize === swipe.swiper.width);

							}
						}
					});

				}

			}

		}

		PubSub.subscribe('windowWidthResize', () => {

			if (window.Swiper && toggleSwipe) {

				toggleSwipe();

			}

		});

		if(window.Swiper && toggleSwipe) {

			toggleSwipe();

		}
		else {

			PubSub.subscribe('swiperJsLoad', toggleSwipe);

		}

		if(!swiperInit) {

			swiperInit = true;

			var script = document.createElement('script');

			script.type = 'text/javascript';
			script.async = true;
			script.src = '/js/swiper.min.js';

			script.onload = () => PubSub.publish('swiperJsLoad');

			setTimeout(() => {

				document.head.appendChild(script);

			}, window.pageYOffset === 0 ? 5000 : 100);

		}

	});

})(document.querySelectorAll('.swiper-container'));