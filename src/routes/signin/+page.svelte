<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import Apple from '$lib/components/ui/icons/Apple.svelte';
	import Google from '$lib/components/ui/icons/Google.svelte';
	import { jwt } from '$lib/stores/auth';
	import { cn } from '$lib/utils/ui-components';
	import { Eye, EyeOff, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { derived } from 'svelte/store';
	import { z } from 'zod';

	const baseURL = env.PUBLIC_STRAPI_URL;

	const GOOGLE_AUTH_URL = `${baseURL}/api/connect/google`;

	const emailSchema = z.string().email({ message: 'Invalid email' });

	let showPassword = $state(false);

	let email = $state('');
	let password = $state('');

	let isSubmitting = $state(false);
	let canContinue = $state(false);

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: ''
	};

	const searchParams = derived(page, ($page) => new URLSearchParams($page.url.search));
	const paramValue = derived(searchParams, ($params) => $params.get('callback_url'));
	const confirmEmail = derived(searchParams, ($params) => $params.get('confirm_email'));

	const signUpURL = $paramValue ? `/signup?callback_url=${$paramValue}` : '/signup';
	const redirectURL = $paramValue || '/reports';

	const handleSubmit = async () => {
		isSubmitting = false;

		if (!canContinue) return;

		isSubmitting = true;

		try {
			const body = JSON.stringify({ identifier: email, password });

			options.body = body;

			const response = await fetch(`${baseURL}/api/auth/local`, options);
			const result = await response.json();

			if (result.error) {
				if (result.error.name === 'ValidationError') {
					toast.error(result.error.message);
				}

				if (result.error.name === 'ApplicationError') {
					if (result.error.message === 'Your account email is not confirmed') {
						options.body = JSON.stringify({ email });

						await fetch(`${baseURL}/api/auth/send-email-confirmation`, options);
						toast.warning(`Email not verified. Check email for verification link`);
					} else {
						toast.warning(result.error.message);
					}
				}

				isSubmitting = false;

				return;
			}

			if (result.jwt && result.user) {
				jwt.set(result.jwt);

				if (browser) {
					sessionStorage.setItem('jwt', result.jwt);
				}

				await goto(redirectURL);

				toast.success('Log in successful');

				return;
			}
		} catch (error) {
			toast.error('An error occured. Please try again.');
			isSubmitting = false;
		}
	};

	const handleTogglePasswordVisibility = () => {
		showPassword = !showPassword;
	};

	$effect(() => {
		const emailCheck = emailSchema.safeParse(email);

		if (emailCheck.success && password.length > 8) {
			canContinue = true;
		} else {
			canContinue = false;
		}

		if ($confirmEmail && JSON.parse($confirmEmail) === true) {
			toast.success('Email has been confirmed. Proceed to login');

			setTimeout(() => goto('/signin'), 2000);
		}
	});
</script>

<div class="min-h-dvh flex items-center justify-center py-10">
	<section class="container flex items-start gap-10 justify-between">
		<div class="lg:w-[580px] w-full flex-shrink-0 pt-10">
			<div>
				<h1 class="text-3xl md:text-[48px] font-powerGroteskBold font-bold md:leading-[46.56px]">
					Welcome Back to 2077 Research
				</h1>

				<p class="mt-3 font-medium text-neutral-40 max-md:text-sm">
					Don't have an account? <a
						class="text-[#0CDEE9] underline underline-offset-[3px] hover:opacity-80 transition"
						href={signUpURL}>Sign up</a
					>
				</p>
			</div>

			<div class="mt-[45px] lg:max-w-[500px] w-full">
				<form onsubmit={handleSubmit}>
					<fieldset disabled={isSubmitting}>
						<div class="space-y-3">
							<label for="email" class="text-xs text-[#9b9b9b] font-mono">E-mail</label>
							<input
								class="block w-full h-12 px-4 md:text-sm placeholder:text-neutral-60 placeholder:font-medium rounded-[8px] focus-within:outline-[#0CDEE9] bg-[#1E1E1E]"
								id="email"
								placeholder="Enter E-mail Address"
								bind:value={email}
							/>
						</div>

						<div class="space-y-3 mt-6">
							<label for="password" class="text-xs text-[#9b9b9b] font-mono">Password</label>

							<div>
								<div class="relative">
									<input
										class="block w-full h-12 px-4 md:text-sm placeholder:text-neutral-60 placeholder:font-medium rounded-[8px] focus-within:outline-[#0CDEE9] pe-11 bg-[#1E1E1E]"
										id="password"
										placeholder="Create a Password"
										type={showPassword ? 'text' : 'password'}
										bind:value={password}
									/>

									<button
										class="text-[#D5D5D5] absolute right-4 top-1/2 -translate-y-1/2"
										onclick={handleTogglePasswordVisibility}
										type="button"
									>
										{#if showPassword}
											<EyeOff class="size-5" />
										{:else}
											<Eye class="size-5" />
										{/if}
									</button>
								</div>
							</div>
						</div>

						<button
							class="mt-10 h-[49px] text-neutral-80 font-bold bg-white rounded-[60px] flex items-center justify-center w-full py-4 px-2.5 hover:shadow-hover transition focus-within:outline-[#0CDEE9] max-md:text-sm disabled:opacity-50 disabled:hover:shadow-none disabled:pointer-events-none relative overflow-hidden"
							type="submit"
							disabled={!canContinue || isSubmitting}
						>
							<span class={cn(isSubmitting && 'invisible')}>Sign in</span>

							{#if isSubmitting}
								<span class="absolute inset-0 bg-transparent flex items-center justify-center">
									<Loader2 class="animate-spin text-neutral-80 size-5" />
								</span>
							{/if}
						</button>
					</fieldset>
				</form>

				<div class={cn('mt-9 transition', isSubmitting && 'opacity-0')}>
					<div class="relative flex items-center justify-center">
						<div class="absolute h-px w-full bg-[#2D2D2D]"></div>
						<p
							class="px-[18px] bg-[#0C0C0D] text-[#5C5C5C] text-sm font-inter flex-shrink-0 relative z-20"
						>
							or
						</p>
					</div>

					<div class="mt-[26px] grid grid-cols-1 gap-2">
						<a href={GOOGLE_AUTH_URL}>
							<button
								class="h-[49px] text-neutral-80 bg-neutral-80 hover:opacity-80 text-white rounded-[60px] flex items-center justify-center gap-2.5 w-full py-4 px-2.5 transition focus-within:outline-[#0CDEE9] text-sm font-medium"
							>
								<Google />
								Continue with Google</button
							>
						</a>

						<button
							class="hidden h-[49px] text-neutral-80 bg-neutral-80 hover:opacity-80 text-white rounded-[60px] items-center justify-center gap-2.5 w-full py-4 px-2.5 transition focus-within:outline-[#0CDEE9] text-sm font-medium"
						>
							<Apple />
							Continue with Apple</button
						>
					</div>
				</div>
			</div>
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
</div>
