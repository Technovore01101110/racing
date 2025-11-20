import { questionCard } from './templates.js';
import { readJson } from '../utils.js';

(async function loadQuestions() {
	const /** @type {typeof import('./questions.json')} */ questions = await readJson(
			'/src/scripts/faq/questions.json'
		);

	const faqContent = questions.map((qa) => questionCard(qa)).join('');
	document.querySelector('.faq-questions').insertAdjacentHTML('beforeend', faqContent);
})();
