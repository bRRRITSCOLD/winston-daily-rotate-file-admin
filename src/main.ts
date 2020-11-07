import App from './App.svelte';
import './styles/_index.scss';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;