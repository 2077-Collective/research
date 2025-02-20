<script>
	import Apple from '$lib/components/ui/icons/Apple.svelte';
	import Google from '$lib/components/ui/icons/Google.svelte';
	import { Check, Eye, EyeOff, X } from 'lucide-svelte';

	let showPassword = $state(false);

	const handleTogglePasswordVisibility = () => {
		showPassword = !showPassword;
	};
</script>

<section class="pt-32 pb-48 container flex items-start gap-10 justify-between">
	<div class="md:w-[580px] w-full flex-shrink-0 pt-10">
		<div>
			<h1 class="text-3xl md:text-[48px] font-powerGroteskBold font-bold md:leading-[46.56px]">
				Create a 2077 Research Account
			</h1>

			<p class="mt-3 font-medium text-neutral-40 max-md:text-sm">
				Already have an account? <a
					class="text-[#0CDEE9] underline underline-offset-[3px] hover:opacity-80 transition"
					href="/signin">Sign in</a
				>
			</p>
		</div>

		<div class="mt-[45px] max-w-[500px] w-full">
			<form>
				<fieldset>
					<div class="space-y-3">
						<label for="email" class="text-xs text-[#9b9b9b] font-mono">E-mail</label>
						<input
							class="block w-full h-12 px-4 md:text-sm placeholder:text-neutral-60 placeholder:font-medium rounded-[8px] focus-within:outline-[#0CDEE9]"
							id="email"
							placeholder="Enter E-mail Address"
						/>
					</div>

					<div class="space-y-3 mt-6">
						<label for="password" class="text-xs text-[#9b9b9b] font-mono">Password</label>

						<div>
							<div class="relative">
								<input
									class="block w-full h-12 px-4 md:text-sm placeholder:text-neutral-60 placeholder:font-medium rounded-[8px] focus-within:outline-[#0CDEE9] pe-11"
									id="password"
									placeholder="Create a Password"
									type={showPassword ? 'text' : 'password'}
								/>

								<button
									class="text-[#D5D5D5] absolute right-4 top-1/2 -translate-y-1/2"
									onclick={handleTogglePasswordVisibility}
								>
									{#if showPassword}
										<EyeOff class="size-5" />
									{:else}
										<Eye class="size-5" />
									{/if}
								</button>
							</div>

							<div class="mt-[11px] font-mono space-y-1.5">
								<div class="text-sm text-[#E4E4E4] flex items-center gap-2">
									<Check class="size-4" />

									<p>At least one lowercase letter</p>
								</div>

								<div class="text-sm text-[#E4E4E4] flex items-center gap-2">
									<Check class="size-4" />

									<p>Minimum 8 characters</p>
								</div>

								<div class="text-sm text-[#E4E4E4] flex items-center gap-2">
									<X class="size-4" />

									<p>At least one uppercase letter</p>
								</div>

								<div class="text-sm text-[#E4E4E4] flex items-center gap-2">
									<X class="size-4" />

									<p>At least one number</p>
								</div>
							</div>
						</div>
					</div>

					<button
						class="mt-10 h-[49px] text-neutral-80 font-bold bg-white rounded-[60px] flex items-center justify-center w-full py-4 px-2.5 hover:shadow-hover transition focus-within:outline-[#0CDEE9] max-md:text-sm"
						type="submit">Create an Account</button
					>
				</fieldset>
			</form>

			<div class="mt-9">
				<div class="relative flex items-center justify-center">
					<div class="absolute h-px w-full bg-[#2D2D2D]"></div>
					<p
						class="px-[18px] bg-[#0C0C0D] text-[#5C5C5C] text-sm font-inter flex-shrink-0 relative z-20"
					>
						or
					</p>
				</div>

				<div class="mt-[26px] grid md:grid-cols-2 gap-2">
					<button
						class="h-[49px] text-neutral-80 bg-neutral-80 hover:opacity-80 text-white rounded-[60px] flex items-center justify-center gap-2.5 w-full py-4 px-2.5 transition focus-within:outline-[#0CDEE9]"
					>
						<Google />
						Continue with Google</button
					>

					<button
						class="h-[49px] text-neutral-80 bg-neutral-80 hover:opacity-80 text-white rounded-[60px] flex items-center justify-center gap-2.5 w-full py-4 px-2.5 transition focus-within:outline-[#0CDEE9]"
					>
						<Apple />
						Continue with Apple</button
					>
				</div>
			</div>
		</div>
	</div>

	<div class="flex-1 max-md:hidden">
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
