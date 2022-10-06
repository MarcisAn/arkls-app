<script>
    import {createClient, getContextClient, gql, queryStore, setContextClient} from '@urql/svelte';

    const client = createClient({
        url: 'http://localhost:4000/graphql',
    });
    setContextClient(client);

    const todos = queryStore({
        client: getContextClient(),
        query: gql`
      query {
        cav {
          res
        }
      }
    `,
    });
    console.log($todos)
</script>

{#if $todos.fetching}
    <p>Loading...</p>
{:else if $todos.error}
    <p>Oh no... {$todos.error.message}</p>
{:else}
    {JSON.stringify($todos.data.cav.res)}
{/if}