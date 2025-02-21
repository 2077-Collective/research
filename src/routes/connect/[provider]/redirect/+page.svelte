<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import { jwt } from '$lib/stores/auth';
	import { error } from '@sveltejs/kit';
	import { Loader2 } from 'lucide-svelte';
	import { derived } from 'svelte/store';

	const baseURL = env.PUBLIC_STRAPI_URL;

	const params = derived(page, ($page) => new URLSearchParams($page.params));
	const providerParamValue = derived(params, ($params) => $params.get('provider'));

	const searchParams = derived(page, ($page) => new URLSearchParams($page.url.search));
	const accessTokenParamValue = derived(searchParams, ($params) => $params.get('access_token'));

	let errorText = $state('');
	let successText = $state('');
	let isLoading = $state(false);

	if (
		($providerParamValue !== 'google' && $providerParamValue !== 'apple') ||
		!$accessTokenParamValue
	) {
		throw error(404, 'Provider does not exist');
	}

	const handleCompleteAuth = async () => {
		isLoading = true;
		errorText = '';
		successText = '';

		try {
			const response = await fetch(
				`${baseURL}/api/auth/${$providerParamValue}/callback?access_token=${$accessTokenParamValue}`
			);

			const result = await response.json();

			if (result.error) {
				if (result.error.message === 'Email is already taken.') {
					errorText =
						'Sorry! This email is linked to another login method. <br/> Try signing in with email and password.';

					return;
				}

				errorText = result.error.message;

				return;
			}

			if (result.jwt) {
				jwt.set(result.jwt);

				if (browser) {
					sessionStorage.setItem('jwt', result.jwt);
				}

				successText =
					'You have been successfully logged in.<br /> You will be redirected in a few seconds...';

				setTimeout(() => goto('/reports'), 2000);

				return;
			}
		} catch (error) {
			errorText = 'An error occured. Please try again.';
		} finally {
			isLoading = false;
		}
	};

	$effect(() => {
		handleCompleteAuth();
	});
</script>

<section class="pt-32 pb-48 container flex items-start gap-10 justify-between">
	<div
		class="lg:w-[580px] w-full flex-shrink-0 pt-10 flex items-center justify-center min-h-[70vh]"
	>
		{#if isLoading}
			<div class="text-center flex flex-col items-center justify-center gap-1.5">
				<Loader2 class="size-5 animate-spin" />
				<p class="text-neutral-20 font-mono">Please wait while we complete authentication...</p>
			</div>
		{:else}
			<div>
				{#if successText}
					<p class="font-mono text-center">
						{@html successText}
					</p>
				{/if}

				{#if errorText}
					<div>
						<p class="font-mono text-center text-red-500">
							{@html errorText}
						</p>

						<div class="mt-5 flex items-center justify-center">
							<a href="/signin">
								<button
									class="h-10 px-4 py-2 flex items-center justify-center font-mono text-sm bg-[#0CDEE9] text-neutral-80 rounded-[8px] font-medium hover:opacity-80 transition"
									>Go back to Sign in
								</button></a
							>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="flex-1 max-lg:hidden flex-shrink-0">
		<img
			src="/HAND_ELEMENT.png"
			class="mix-blend-screen pointer-events-none select-none -mt-6"
			alt="hand-element"
			width="689px"
			height="608px"
			loading="eager"
			fetchpriority="high"
			decoding="async"
		/>
	</div>
</section>
