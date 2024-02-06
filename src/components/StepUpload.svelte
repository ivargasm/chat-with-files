<script>
    import { appStatus, setAppStatusLoading, setAppStatusError, setAppStatusChatMode } from '../pages/store.ts'
    import Dropzone from "svelte-file-dropzone";

    let files = {
        accepted: [],
        rejected: []
    };

    async function handleFilesSelect(e) {
        const { acceptedFiles, fileRejections } = e.detail;
        
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];

        // si existen archivos aceptados cambiar el estado
        if(acceptedFiles.length > 0){
            setAppStatusLoading()

            // subir el archivo con la api
            const formData = new FormData()
            formData.append('file',acceptedFiles[0])

            const res = await fetch('/api/upload',{
                method:'POST',
                body:formData
            })

            if(!res.ok){
                setAppStatusError()
                return
            }

            const {id, url, pages} = await res.json()
            setAppStatusChatMode({id, url, pages})


        }
    }
</script>

{#if files.accepted.length === 0}
    <Dropzone
        on:drop={handleFilesSelect}
        multiple={false}
        accept='application/pdf'
    >
        Arrastra y suelta aqui tu PDF
    </Dropzone>
{/if}

<ol>
    {#each files.accepted as item}
        <li>{item.name}</li>
    {/each}
</ol>