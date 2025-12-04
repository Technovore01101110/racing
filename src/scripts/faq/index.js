import { questionCard } from './templates.js';
import { readJson } from '../utils.js';
import { initFaqSelfClose } from './faqControls.js';

(async function loadFaqPage() {
	// Load Questions
	const /** @type {typeof import('./questions.json')} */ questions = await readJson(
			'/src/scripts/faq/questions.json'
		);

	const faqContent = questions.map((qa) => questionCard(qa)).join('');
	document.querySelector('.faq-questions').insertAdjacentHTML('beforeend', faqContent);

	// Init Listeners
	initFaqSelfClose();
})();
