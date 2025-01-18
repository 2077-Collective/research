<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import TeamCard from '$lib/components/ui/team-card/TeamCard.svelte';
</script>

<BaseHead />

<div class="px-3 md:px-12 flex flex-col gap-8">
	<section>
		<h2
			id="about-us"
			class="text-3xl md:text-5xl font-medium leading-9 mb-4 md:mb-8 font-soehne tracking-tight"
		>
			About us
		</h2>
		<div class="md:text-lg leading-relaxed max-w-screen-lg space-y-4 text-pretty">
			<p>
				2077 Research is a research firm dedicated to producing in-depth analysis and insights on
				decentralized tech and the web3 movement. We collaborate with industry leaders to deliver
				state-of-the-art research on Ethereum and the broader crypto ecosystem.
			</p>
			<p>
				Though some of our articles are sponsored, our research articles are meant to be neutral and
				unbiased. If there are flaws, we will highlight them. If there are benefits, we will also
				highlight those. We're not KOLs.
			</p>
		</div>
	</section>
	<section>
		<h2
			id="team"
			class="text-2xl md:text-4xl font-medium leading-9 mb-4 md:mb-8 font-soehne tracking-tight"
		>
			Core
		</h2>
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			<TeamCard
				twitter_username="eawosikaa"
				full_name="Emmanuel Awosika"
				role="CEO"
				summary="Chaos agent. Learning machine. Crazy genius. Ethernaut making Ethereum cool again."
			/>
			<TeamCard
				twitter_username="lynettdoteth"
				full_name="Lynett Simons"
				role="Developer"
				summary="i chase pigeons for fun"
			/>
		</div>
	</section>
</div>
