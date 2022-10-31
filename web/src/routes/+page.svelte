<script>
    import Landing from "../components/landing.svelte"
    import {createClient, setContextClient} from '@urql/svelte';
    import {dev} from "$app/environment";

    let url;
    if (dev) {
        url = "http://localhost:4000/graphql"
    } else {
        url = "https://arkls-api.cvgmerch.lv/graphql"
    }
    const client = createClient({
        url: url,
        fetchOptions: () => {
            return {
                credentials: "include",
            };
        },
    });
    setContextClient(client);
</script>

<Landing/>
