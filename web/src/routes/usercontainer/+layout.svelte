<script>
    import {createClient, gql, setContextClient} from "@urql/svelte";
    import {goto} from '$app/navigation';

    const client = createClient({
        url: 'http://localhost:4000/graphql',
        fetchOptions: () => {
            return {
                credentials: "include",
                cache: "no-cache"
            };
        },
    });
    setContextClient(client);

    function loginMut(e) {
        e.preventDefault()
        const MUT = gql`
        mutation Logout {
            logout
        }
      `
        client.mutation(MUT).toPromise().then(res => {
            if (res.data.logout == true) {
                goto("/")
            }
        })
    };
</script>


<div class="usercontainer">
    <header>
        <h1>arkls</h1>
        <button on:click={loginMut}>logout</button>
    </header>
    <main>
        <slot></slot>
    </main>
    <footer>
        <a href="/usercontainer/addtask">
            <strong>Pievienot uzdevumu</strong>
        </a>
        <a href="/usercontainer">
            Kopskats
        </a>
        <a href="/usercontainer/group">
            Draugi
        </a>
        <a href="/usercontainer/calendar">
            Kalendārs
        </a>
        <a href="/usercontainer/settings">
            Uzstādījumi
        </a>

    </footer>
</div>


<style lang="scss">
  .usercontainer {
    background-color: #d3d3d3;
    display: flex;
    height: 100%;
    flex-direction: column;

    header {
      background-color: #a1a1a1;
    }

    main {
      flex: 1;
    }

    footer {
      background-color: #ff9757;
      display: flex;
      height: 5%;
      justify-content: space-around;

      a {
        text-decoration: none;
        color: black;
        font-size: 20px;
      }
    }
  }
</style>