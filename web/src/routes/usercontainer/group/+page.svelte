<script>
    import {getContextClient, gql, queryStore} from "@urql/svelte";
    import User from "../../../components/user.svelte"
    import sortBy from 'lodash/sortBy'
    import {derived} from "svelte/store";

    const users = queryStore({
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
    console.log($users.data)
    //console.log(derived($users.data.getUsers, users => sortBy(users, "isFriend")))
</script>

{#if $users.fetching}
    <p>Loading...</p>
{:else if $users.error}
    <p>Oh no... {$users.error.message}</p>
{:else}
    <div class="users">
        {#each $users.data.getUsers as user}
            <User username={user.username} isFriend={user.isFriend}/>
        {/each}
    </div>

{/if}

<style lang="scss">
  .users {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 2em;
  }
</style>