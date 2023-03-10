<script lang="ts">
    import { onMount, afterUpdate } from "svelte";

    export let component: HTMLElement;
    export let columns: number;
    export let columnWidth: number;
    export let column: number;

    let destination: HTMLDivElement;
    let valid = false;
    let active = false;

    let x: number = 0;
    let y: number = 0;

    onMount(() => {
        valid = component.attributes != null;
        if (!valid) return;
        
        component.style.position="absolute";
        component.style.zIndex="1";
        console.log(component);

        component.ondragstart = () => {return false;};
        component.addEventListener(("mousedown"), (e) => {
            active = true;
            component.style.zIndex="5";
        });
            
        component.addEventListener(("mouseup"), (e) => {
            active = false;
            component.style.zIndex="1";
        });
                
        window.addEventListener(("mousemove"), (e) => {
            if (!active) return;
            
            x += e.movementX;
            y += e.movementY;

            if (e.clientX < column*columnWidth) {
                column -= 1;
            } else if (e.clientX > (column+1)*columnWidth) {
                column += 1;
            }
        });
        destination.appendChild(component);
    });
    $: if (valid && active) {
        component.style.left = x + "px";
        component.style.top = y + "px";
    }

    $: if (valid && !active) {
        x = (column * columnWidth) - component.getBoundingClientRect().width/2 + columnWidth/2;
        component.style.left = x + "px";
        component.style.top = y + "px";
    }



</script>

<div bind:this={destination} bind:offsetWidth={x} id="dest"/>

<style>
    #dest {
        width: auto;
        height: auto;
    }
</style>