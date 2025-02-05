<script>
	import katex from 'katex';
	import 'katex/dist/katex.min.css';

	export let expression = '';

	let renderedHTML = '';

	$: renderedHTML = katex.renderToString(expression, {
		throwOnError: false
	});
</script>

<div>{@html renderedHTML}</div>
