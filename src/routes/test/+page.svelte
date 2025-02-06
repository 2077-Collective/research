<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import Latex from '$lib/components/ui/Latex.svelte';
</script>

<BaseHead />

<div class="container py-10">
	<p>Polynomials are a special class of algebraic expressions of the form:</p>

	<ul>
		<li><Latex expression="x + 5" /></li>
		<li><Latex expression="x^4" /></li>
		<li><Latex expression="x^3 + 3x^2 + 3x + 1" /></li>
		<li><Latex expression="628x^{271} + 318x^{270} + 530x^{269} + \dots + 69x + 381" /></li>
	</ul>

	<div>
		i.e. they are a sum of any (finite!) number of terms of the form <Latex expression="cx^k" />.
	</div>

	<p>
		There are many things that are fascinating about polynomials. But here we are going to zoom in
		on a particular one: <strong
			>polynomials are a single mathematical object that can contain an unbounded amount of
			information</strong
		> (think of them as a list of integers and this is obvious). The fourth example above contained 816
		digits of tau, and one can easily imagine a polynomial that contains far more.
	</p>

	<div>
		Furthermore, <strong
			>a single equation between polynomials can represent an unbounded number of equations between
			numbers</strong
		>. For example, consider the equation
		<Latex expression="A(x) + B(x) = C(x)" />. If this equation is true, then it's also true that:
	</div>

	<ul>
		<li><Latex expression="A(0) + B(0) = C(0)" /></li>
		<li><Latex expression="A(1) + B(1) = C(1)" /></li>
		<li><Latex expression="A(2) + B(2) = C(2)" /></li>
		<li><Latex expression="A(3) + B(3) = C(3)" /></li>
	</ul>
</div>
