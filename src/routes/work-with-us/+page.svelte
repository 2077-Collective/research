<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import Accordion from '$lib/components/ui/accordion/accordion.svelte';
	import Abcde from '$lib/components/ui/icons/partners/ABCDE.svelte';
	import Azuki from '$lib/components/ui/icons/partners/Azuki.svelte';
	import Cio from '$lib/components/ui/icons/partners/Cio.svelte';
	import EigenLayer from '$lib/components/ui/icons/partners/EigenLayer.svelte';
	import FastCompany from '$lib/components/ui/icons/partners/FastCompany.svelte';
	import Fuel from '$lib/components/ui/icons/partners/Fuel.svelte';
	import Light from '$lib/components/ui/icons/partners/Light.svelte';
	import MegaEth from '$lib/components/ui/icons/partners/MegaEth.svelte';
	import Metalex from '$lib/components/ui/icons/partners/Metalex.svelte';
	import Pymnts from '$lib/components/ui/icons/partners/Pymnts.svelte';
	import Spire from '$lib/components/ui/icons/partners/Spire.svelte';
	import Starknet from '$lib/components/ui/icons/partners/Starknet.svelte';
	import Testimonials3 from '$lib/components/ui/Testimonials3.svelte';
	import { CheckSquare2, Copy } from 'lucide-svelte';

	const partners = [
		FastCompany,
		Pymnts,
		Cio,
		Spire,
		EigenLayer,
		Light,
		Starknet,
		MegaEth,
		Abcde,
		Azuki,
		Metalex,
		FastCompany,
		Fuel,
		Cio,
		EigenLayer,
		FastCompany,
		Spire,
		Starknet,
		MegaEth
	];

	let text = 'research@2077.xyz';
	let copied = $state(false);

	async function handleCopyEmail() {
		if (copied) return;
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
		} catch (err) {
			console.error('Failed to copy:', err);
		} finally {
			setTimeout(() => {
				copied = false;
			}, 1500);
		}
	}
</script>

<BaseHead />

<div class="pt-32">
	<section class="max-w-[680px] mx-auto container">
		<h1 id="work-with-us" class="text-3xl md:text-[32px] font-bold mb-4 font-powerGroteskBold">
			Work with us
		</h1>

		<div class="leading-relaxed max-w-screen-lg space-y-4 text-pretty text-neutral-10">
			<p>
				2077 Research works with visionary teams pushing the boundaries of innovation across DeFi,
				interoperability, privacy, UX, scaling, and more crypto verticals. As a research partner, we
				help make the more technical details of protocols accessible to a wider audience and
				communicate their value sans the hype of KOLs and influencers.
			</p>

			<div class="space-y-1.5">
				<p>
					Our expertise lies in producing in-depth reports packed with thorough explanations and
					research-driven insights on crypto infrastructure and products. <br />Want to work with
					us?
				</p>
				<p class="text-base flex items-center gap-1.5">
					Send an e-mail to {' '}
					<a href="mailto:research@2077.xyz" class="text-[#0BC8D2] hover:underline"
						>research@2077.xyz
					</a>
					<button onclick={handleCopyEmail} disabled={copied}>
						{#if !copied}
							<Copy class="size-4 text-neutral-60" />
						{:else}
							<CheckSquare2 class="size-4 fill-[#0BC8D2] text-white" />
						{/if}
					</button>
				</p>
			</div>
		</div>
	</section>

	<section class="overflow-hidden md:mt-10 relative mt-16">
		<img
			class="2xl:h-[480px] h-[480px] md:size-full object-cover opacity-50"
			src="/perspective-grid-work.png"
			alt="perspective grid work with us"
		/>

		<div class="absolute left-1/2 -translate-x-1/2 z-30 top-0 mt-6 md:mt-14">
			<p class="text-sm font-bold text-[#0CDEE9]">{`{Trusted by}`}</p>

			<div class="w-[350px] md:w-[650px] mt-4 flex items-center flex-wrap flex-shrink-0">
				{#each partners as PartnerIcon}
					<div
						class="h-[47px] p-4 border-[0.807px] border-[#262626] bg-[#0B0B0C] flex items-center justify-center text-[#A6A6A6] hover:text-black hover:bg-[#0CDEE9] transition"
					>
						<PartnerIcon />
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-[#020203] py-10 md:py-20">
		<div class="container">
			<h2 id="faq" class="text-2xl md:text-[32px] font-bold leading-9 mb-4 font-powerGroteskBold">
				FAQs
			</h2>

			<Accordion
				items={[
					{
						title: 'Who is the target audience?',
						content:
							'Our research is tailored for highly technical and semi-technical audiences in the cryptocurrency space including developers, researchers, and protocol team members who want to deeply understand DeFi mechanisms and Ethereum architecture.'
					},
					{
						title: 'What does this research cover?',
						content:
							'We aim to provide rigorous, in-depth analysis that goes beyond surface-level explanations to examine the underlying systems and code, covering everything from consensus algorithms to VM design.'
					},
					{
						title: 'How do I get in touch?',
						content: 'You can contact us for inquiries by our email address, research@2077.xyz.'
					}
				]}
			/>
		</div>
	</section>

	<section>
		<Testimonials3 />
	</section>
</div>
