<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Apple from '$lib/components/ui/icons/Apple.svelte';
	import Google from '$lib/components/ui/icons/Google.svelte';
	import { supabase } from '$lib/utils/supabase';
	import { cn } from '$lib/utils/ui-components';
	import { Eye, EyeOff, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { derived } from 'svelte/store';
	import { z } from 'zod';

	const pageUrl = $page.url.origin;

	const emailSchema = z.string().email({ message: 'Invalid email' });

	let showPassword = $state(false);

	let email = $state('');
	let password = $state('');

	let isSubmitting = $state(false);
	let canContinue = $state(false);

	const searchParams = derived(page, ($page) => new URLSearchParams($page.url.search));
	const paramValue = derived(searchParams, ($params) => $params.get('callback_url'));
	const confirmEmail = derived(searchParams, ($params) => $params.get('confirm_email'));

	const signUpURL = $paramValue ? `/signup?callback_url=${$paramValue}` : '/signup';
	const redirectURL = $paramValue || '/reports';

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		isSubmitting = false;

		if (!canContinue) return;

		isSubmitting = true;

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (data.user) {
				await goto(redirectURL);

				toast.success('Log in successful');

				return;
			}

			if (error) {
				if (error.code === 'invalid_credentials') {
					toast.error('Invalid credentials');

					return;
				}
			}
		} catch (error) {
			toast.error('An error occured. Please try again.');
		} finally {
			isSubmitting = false;
		}
	};

	const handleTogglePasswordVisibility = () => {
		showPassword = !showPassword;
	};

	const handleGoogleSignin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: $paramValue ? `${pageUrl}${$paramValue}` : `${pageUrl}/reports`
			}
		});
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

<div class="min-h-dvh flex items-center justify-center py-16 md:py-32">
	<section class="container flex items-start gap-10 justify-between">
		<div class="lg:w-[580px] w-full flex-shrink-0 pt-10">
			<div>
				<h1 class="text-3xl md:text-[48px] font-powerGroteskBold font-bold md:leading-[46.56px]">
					Welcome Back to 2077 Research
				</h1>

				<p class="mt-3 font-medium text-neutral-40 max-md:text-sm">
					Don't have an account? <a
						class="text-[#0CDEE9] underline underline-offset-[3px] hover:opacity-80 transition font-semibold"
						href={signUpURL}>Sign up</a
					>
				</p>
			</div>

			<div class="mt-[45px] lg:max-w-[500px] w-full">
				<form onsubmit={handleSubmit}>
					<fieldset disabled={isSubmitting}>
						<div class="space-y-3">
							<label for="email" class="text-sm text-[#9b9b9b] font-mono">E-mail</label>
							<input
								class="block w-full h-12 px-4 md:text-sm placeholder:text-neutral-60 placeholder:font-medium rounded-[8px] focus-within:outline-[#0CDEE9] bg-[#1E1E1E] font-ibm"
								id="email"
								placeholder="Enter E-mail Address"
								bind:value={email}
							/>
						</div>

						<div class="space-y-3 mt-6">
							<label for="password" class="text-sm text-[#9b9b9b] font-mono">Password</label>

							<div>
								<div class="relative">
									<input
										class="block w-full h-12 px-4 md:text-sm placeholder:text-neutral-60 placeholder:font-medium rounded-[8px] focus-within:outline-[#0CDEE9] pe-11 bg-[#1E1E1E] font-ibm"
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
							class="mt-10 h-[49px] text-neutral-80 font-bold bg-white rounded-[60px] flex items-center justify-center w-full py-4 px-2.5 hover:shadow-hover transition focus-within:outline-[#0CDEE9] max-md:text-sm disabled:opacity-50 disabled:hover:shadow-none disabled:pointer-events-none relative overflow-hidden font-ibm"
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
							class="px-[18px] bg-[#0C0C0D] text-[#5C5C5C] text-sm font-ibm flex-shrink-0 relative z-20"
						>
							or
						</p>
					</div>

					<div class="mt-[26px] grid grid-cols-1 gap-2">
						<button
							class="h-[49px] text-neutral-80 bg-neutral-80 hover:opacity-80 text-white rounded-[60px] flex items-center justify-center gap-2.5 w-full py-4 px-2.5 transition focus-within:outline-[#0CDEE9] text-sm font-medium font-ibm"
							onclick={handleGoogleSignin}
						>
							<Google />
							Continue with Google</button
						>

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
			<enhanced:img
				src="/static/HAND_ELEMENT.png"
				class="mix-blend-screen pointer-events-none select-none -mt-6"
				alt="hand-element"
				width="689px"
				height="608px"
				loading="lazy"
				fetchpriority="high"
				decoding="async"
			/>
		</div>
	</section>
</div>
