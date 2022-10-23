<script>
    import Auth from "./auth.svelte";
    import {getContextClient, gql, queryStore} from "@urql/svelte";
    import { goto } from '$app/navigation';

    const me = queryStore({
        client: getContextClient(),
        query: gql`
      query Me{
        me {
          id
        }
      }
    `,
    });

    $: $me.data && checkIfLoggedIn()

    function checkIfLoggedIn() {
        if ($me.data.me) {
            goto("/usercontainer")
        }
    }


</script>

<div class="landing">
    <header>
        <h1>Arkls</h1>
    </header>
    <main>
        <Auth/>
    </main>
    <footer>
    </footer>
</div>

<style lang="scss">
  body {
    div {
      height: 100%;
    }
  }

  .landing {
    background-color: beige;
    height: 100%;
    display: flex;
    flex-direction: column;

    header {
      h1 {
        background-color: red;
      }
    }

    main {
      flex: 1;
    }

    footer {
      background-color: red;
    }

  }

</style>