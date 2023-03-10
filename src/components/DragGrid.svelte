<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import DragComponent from "./DragComponent.svelte";
    import { v4 as uuidv4 } from 'uuid';

    export let columns = 1;
    export let gap = 0;
    let columnWidth = 0;

    let src: HTMLDivElement;
    let children: HTMLElement[] = [];
    let ids: string[] = [];
    let positions: number[][] = Array(columns).fill([]);

    // make this not clear every time and only update difference
    afterUpdate(() => {
        columnWidth = window.innerWidth / columns;
        if (src.hasChildNodes()) {
            for (let i = 0; i < src.childNodes.length; i++) {
                let clonedNode = src.childNodes[i].cloneNode(true);
                children = [...children, <HTMLElement> clonedNode];
                ids = [...ids, uuidv4()];
            }
        }
    });
</script>

<div style:display="none" bind:this={src}>
    <slot />
</div>

<div>
    {#each children as child, i (ids[i])}
        <DragComponent component={child} {columns} {columnWidth} column={i % columns}/>
    {/each}
</div>