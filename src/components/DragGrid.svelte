<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import DragComponent from "./DragComponent.svelte";

    let src: HTMLDivElement;
    let children: HTMLElement[] = [];
    let ids: number[] = [];
    export let columns = 1;
    let positions: number[][] = Array(columns).fill([]);
    let columnWidth = 0;

    // make this not clear every time and only update difference
    afterUpdate(() => {
        columnWidth = window.innerWidth / columns;
        if (src.hasChildNodes()) {
            //children = [];
            for (let i = 0; i < src.childNodes.length; i++) {
                children = [...children, <HTMLElement>(<HTMLElement>src.childNodes[i]).cloneNode(true)];
                // make uuid
                ids=  [...ids, Math.random() * 1000];
            }
        }
    });
</script>

<div id="hide" style:display="none" bind:this={src}>
    <slot />
</div>

<div id="grid">
    {#each children as child, i (ids[i])}
        <DragComponent component={child} {columns} {columnWidth} column={i % columns}/>
    {/each}
</div>