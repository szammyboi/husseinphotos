<script lang="ts">
    import { DeleteEntry, type Entry } from "$lib/firebase/database";
    import { onMount } from "svelte";

    let image: HTMLImageElement;

    export let path: string;
    export let entry: Entry;

    onMount(async () => {
        let test = new Image();
        test.src = "https://cdn.szammy.com/highres/" + path;
        test.decode().then(() => image.src = test.src);
    });

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<img 
    class="w-full aspect-auto pb-6"
    bind:this={image} 
    alt="" 
    src={"https://cdn.szammy.com/lowres/" + path}
    on:click={() => {
        DeleteEntry(entry);
        image.remove();
    }}
/>

