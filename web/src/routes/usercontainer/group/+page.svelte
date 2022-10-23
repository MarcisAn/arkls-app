<script>
    import {getContextClient, gql, queryStore} from "@urql/svelte";
    import User from "../../../components/user.svelte"

    const todos = queryStore({
        client: getContextClient(),
        query: gql`
      query {
        getUsers {
          username
          isFriend
        }
      }
    `,
    });
    console.log($todos.data)
</script>

{#if $todos.fetching}
    <p>Loading...</p>
{:else if $todos.error}
    <p>Oh no... {$todos.error.message}</p>
{:else}
    <div class="users">
        {#each $todos.data.getUsers as user}
            <User username={user.username}/>
        {/each}
    </div>

{/if}

<style lang="scss">
    .users{
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin: 2em;
    }
</style>