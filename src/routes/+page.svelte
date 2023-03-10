<script lang="ts">
	import { 
		AddEntry, 
		FetchEntries, 
		UploadImage, 
		CurrentDate, 
		ClearEntries, 
		type Entry
	} from "$lib/firebase/database";
    import { onMount } from "svelte";
    import DragComponent from "../components/DragComponent.svelte";
    import DragGrid from "../components/DragGrid.svelte";
    import ProgressiveImage from "../components/ProgressiveImage.svelte";

	let data: Entry[] = [];

	let fileUpload: HTMLInputElement;
	let files: FileList;

	onMount(async () => data = await FetchEntries());

	const UploadFiles = async (fs: FileList) => {
		await Promise.all(Array.prototype.map.call(fs, async (file: File) => {
			let newEntry: Entry = {
				imagePath: file.name,
				title: file.name,
				date: CurrentDate()
			};

			await AddEntry(newEntry);
			await UploadImage(file.name, file);

			data = [...data, newEntry];
		}));

		fileUpload.value = "";
	}

	$: if (files) UploadFiles(files);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="zhussein"/>
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<section on:click={() => {}}>
	<input type="file" 
		bind:files={files} 
		bind:this={fileUpload}
		accept="image/png, image/jpeg, image/avif, image/webp"
		multiple
	/>
	<button on:click={ClearEntries}>Clear</button>
	<br>
	<!--class="columns-1 sm:columns-2 md:columns-3 m-6 mb-0 gap-6"-->
	<div>
		<DragGrid columns={3}>
			{#each data as entry, i}
				<img src={"https://cdn.szammy.com/lowres/" + entry.imagePath} alt="" width="100px" height="100px"/>
			{/each}
		</DragGrid>
		{#each data as entry, i}
		
			<!--ProgressiveImage 
				path={entry.imagePath}
				{entry}
			/>
			-->
		{/each}
	</div>
</section>