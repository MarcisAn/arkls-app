<script>
    import Landing from "../components/landing.svelte"
    import {createClient, getContextClient, gql, queryStore, setContextClient} from '@urql/svelte';

    const client = createClient({
        url: 'http://localhost:4000/graphql',
        fetchOptions: () => {
            return {
                credentials: "include",
            };
        },
    });
    setContextClient(client);
</script>

<Landing />
