<script lang="ts">
    import type { PageData } from './$types';
    import DOMPurify from 'dompurify';

    export let data: PageData;
    const { post } = data;
    const sanitizedContent = post.content ? DOMPurify.sanitize(post.content) : '';

    function formatDate(timestamp: number | null): string {
        if (!timestamp) return '';
        try {
            return new Date(timestamp * 1000).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error');
            console.error('Error formatting date:', error);
            return '';
        }
    }
</script>

<svelte:head>
    <title>{post.title} | Ethereum Navigator</title>
    <meta name="description" content={post.preview_text} />
</svelte:head>

<div class="text-white">
    <article class="container mx-auto px-4 py-16 max-w-4xl">
        {#if post.thumbnail_url}
            <img 
                src={post.thumbnail_url} 
                alt={post.title}
                class="w-full aspect-video object-cover rounded-lg mb-8" />
        {/if}

        <header class="mb-8">
            <time class="text-sm text-zinc-400 mb-4 block">
                {formatDate(post.publish_date)}
            </time>
            
            <h1 class="text-4xl font-bold mb-4">{post.title}</h1>
            
            {#if post.subtitle}
                <p class="text-xl text-zinc-400">{post.subtitle}</p>
            {/if}
        </header>

        <div class="flex items-center gap-4 mb-8 border-y border-zinc-800 py-6">
            {#if post.authors && post.authors.length > 0}
                {#each post.authors as author}
                    <div class="flex items-center gap-2">
                        <img 
                            src="https://beehiiv-images-production.s3.amazonaws.com/uploads/user/profile_picture/5b0c5e78-b7a5-4966-afb6-572c8f3304c8/2077_.png"
                            alt={`${author}'s profile picture`}
                            class="w-6 h-6 rounded-full" />
                        <span class="text-sm text-zinc-400">{author}</span>
                    </div>
                {/each}
            {/if}
        </div>

        <div class="prose prose-invert prose-lg max-w-none">
            {#if post.content}
                {@html sanitizedContent}
            {:else}
                <div class="p-8 text-center bg-zinc-900 rounded-lg">
                    <p class="text-zinc-400 mb-4">Content currently unavailable.</p>
                    <a 
                        href={post.web_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-teal-400 hover:text-teal-300"
                    >
                        Read on Beehiiv →
                    </a>
                </div>
            {/if}
        </div>
    </article>
</div>

<style>
    :global(.prose) {
        max-width: none;
    }
    :global(.prose img) {
        margin: 2rem auto;
        border-radius: 0.5rem;
    }
    :global(.prose a) {
        color: #2DD4BF;
        text-decoration: none;
    }
    :global(.prose a:hover) {
        text-decoration: underline;
    }
    :global(.prose pre) {
        background-color: rgb(17 24 39);
        border-radius: 0.5rem;
        padding: 1rem;
    }
    :global(.prose blockquote) {
        border-left-color: #2DD4BF;
    }
    :global(.prose h1, .prose h2, .prose h3, .prose h4) {
        color: white;
    }
    :global(.prose p, .prose ul, .prose ol) {
        color: rgb(156 163 175);
    }
</style>