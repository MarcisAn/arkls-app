<script>
    import Landing from "../components/landing.svelte"
    import {createClient, getContextClient, gql, queryStore, setContextClient} from '@urql/svelte';

    const client = createClient({
        url: 'http://174.138.8.115/graphql',
        fetchOptions: () => {
            return {
                credentials: "include",
            };
        },
    });
    setContextClient(client);
</script>

<Landing />
