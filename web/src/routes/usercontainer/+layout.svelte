<script>
    import {createClient, getContextClient, gql, queryStore, setContextClient} from "@urql/svelte";
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
        const todos = queryStore({
            client: client,
            query: gql`
      query {
        todos {
          id
          title
        }
      }
    `,
        });
        client.mutation(MUT).toPromise().then(res => {
            if (res.data.logout == true) {
                goto("/")
            }
        })
    };
</script>

<div class="usercontainer">
    <header>
        <img src="/header.png" alt="">
        <button on:click={loginMut}>Iziet</button>
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
      display: flex;

      @media only screen and (max-width: 600px) {
        flex-direction: column;
      }
      flex-direction: row;
      justify-content: space-between;

      button {
        width: 100px;
        background-color: #FFAD01;
        border: none;
        margin: 10px;
        font-size: xx-large;
      }

      img {
        object-fit: contain;
        height: 70px;
      }

      background-color: #a1a1a1;
    }

    main {
      flex: 1;
    }

    footer {
      background-color: #ff9757;
      display: flex;
      @media only screen and (max-width: 600px) {
        flex-direction: column;
      }
      text-align: center;
      justify-content: space-around;

      a {
        border-bottom: 1px solid black;
        text-decoration: none;
        color: black;
        font-size: 20px;
      }
    }
  }
</style>