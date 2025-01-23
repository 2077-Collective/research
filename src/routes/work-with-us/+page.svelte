<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import Accordion from '$lib/components/ui/accordion/accordion.svelte';
	import Testimonials from '$lib/components/ui/Testimonials.svelte';
</script>

<BaseHead />

<div class="px-3 md:px-12 flex flex-col gap-8">
	<section>
		<h1
			id="work-with-us"
			class="text-3xl md:text-5xl font-medium leading-9 mb-4 md:mb-8 font-soehne tracking-tight"
		>
			Work with us
		</h1>
		<div class="md:text-lg leading-relaxed max-w-screen-lg space-y-4 text-pretty">
			<p>
				2077 Research can work with your DeFi protocol or other crypto project to produce neutral,
				unbiased technical reports. If you are a protocol interested in working with us, you can
				contact us via email: <a
					href="mailto://research@2077.xyz"
					class="text-blue-500 hover:underline">research@2077.xyz</a
				>.
			</p>
			<p>
				Our research has reached over 150,000 people and been shared by the community 300+ times.
			</p>
		</div>
	</section>
	<section>
		<h2
			id="faq"
			class="text-2xl md:text-4xl font-medium leading-9 mb-2 md:md-4 font-soehne tracking-tight"
		>
			FAQ
		</h2>

		<Accordion
			items={[
				{
					title: 'Who is our research for?',
					content:
						'Our research is tailored for technical audiences in the cryptocurrency space including developers, researchers, and protocol team members who want to deeply understand DeFi mechanisms and smart contract architecture. We aim to provide rigorous, in-depth analysis that goes beyond surface-level explanations to examine the underlying systems and code.'
				},
				{
					title: 'Meow?',
					content:
						'Lorem ipsum odor amet, consectetuer adipiscing elit. Eros vestibulum accumsan in condimentum purus sollicitudin laoreet. Et facilisis egestas maecenas gravida hac porttitor commodo conubia. Metus donec augue, sed diam varius hendrerit. Vitae aliquet efficitur volutpat eleifend tincidunt diam nulla aptent donec.'
				},
				{
					title: 'Accordion Item 3',
					content:
						'At tortor nullam ultrices nisi interdum facilisi semper. Et himenaeos viverra eleifend dolor euismod commodo. Cras gravida lobortis scelerisque maximus dui nulla.'
				}
			]}
		/>
	</section>
	<section>
		<Testimonials />
	</section>
</div>
