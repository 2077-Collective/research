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
				detailed technical reports. If you are a protocol interested in working with us, you can
				contact us via email: <a
					href="mailto://research@2077.xyz"
					class="text-blue-500 hover:underline">research@2077.xyz</a
				>.
			</p>
			<p><a href="/about" class="text-blue-500 hover:underline">Read more about us here.</a></p>
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
	</section>
	<section>
		<Testimonials />
	</section>
</div>
