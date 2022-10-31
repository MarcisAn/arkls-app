<script>
    import Landing from "../components/landing.svelte"
    import {createClient, getContextClient, gql, queryStore, setContextClient} from '@urql/svelte';

    const client = createClient({
        url: 'https://arkls-api.cvgmerch.lv/graphql',
        fetchOptions: () => {
            return {
                credentials: "include",
            };
        },
    });
    setContextClient(client);
</script>

<Landing />
