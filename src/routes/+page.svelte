<script lang="ts">
	import { AddEntry, FetchEntries, UploadImage, CurrentDate, CDN_LOCATION, type Entry } from "$lib/firebase/database";

	let fileUpload: HTMLInputElement;
	let files: FileList;

	const UploadFiles = async (fs: FileList) => {
		await Promise.all(Array.prototype.map.call(fs, async (file: File) => {
			let newEntry: Entry = {
				imagePath: file.name,
				title: file.name,
				date: CurrentDate()
			};

			await AddEntry(newEntry);
			await UploadImage(file.name, file);
		}));

		fileUpload.value = "";
	}

	$: if (files) UploadFiles(files);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="zhussein"/>
</svelte:head>

<section>
	<input type="file" 
		bind:files={files} 
		bind:this={fileUpload}
		accept="image/png, image/jpeg"
		multiple
	/>

	<br>

	{#await FetchEntries()}
		<p>...loading images</p>
	{:then data}
		{#each data as entry (entry.imagePath)}
			<img 
				width={300}
				src={CDN_LOCATION + "/" + entry.imagePath} 
				alt="" 
			/>
		{/each}
	{:catch error}
		<h1>oops {error}</h1>
	{/await}
</section>

<style>
</style>
