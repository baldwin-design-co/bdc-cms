/* eslint-disable no-undef */
const bdcforms = document.querySelectorAll('form');
bdcforms.forEach(form => {
	form.addEventListener('submit', e => {
		e.preventDefault();

		const formName = form.dataset.name;
		const site = window.location.hostname;

		const successMessage = document.querySelector(`#${formName}-success`);
		const errorMessage = document.querySelector(`#${formName}-error`);

		const inputSelectors = [ 'input:not([type="submit"])', 'textarea', 'select' ];

		const inputs = Array.from(form.querySelectorAll(inputSelectors.join()));
		const data = inputs.reduce((data, input) => {
			data[input.dataset.name] = input.value;
			return data;
		}, {});

		errorMessage.style.display = 'none';

		firebase
			.firestore()
			.collection(`sites/${site}/forms/${formName}/submissions`)
			.add(data)
			.then(() => {
				form.style.display = 'none';
				errorMessage.style.display = 'none';
				successMessage.style.display = 'block';
			})
			.catch(() => {
				errorMessage.style.display = 'block';
			});
	});
});
