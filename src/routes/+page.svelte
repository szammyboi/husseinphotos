<script lang="ts">
	import { UploadImage } from "$lib/firebase/database";

	let fileUpload: HTMLInputElement;
	let files: FileList;

	const UploadFiles = async (fs: FileList) => {
		await Promise.all(Array.prototype.map.call(fs, async (file: File) => {
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
</section>

<style>
</style>
