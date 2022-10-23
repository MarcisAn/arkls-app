<script>
    import {getContextClient, gql, mutationStore} from "@urql/svelte";
    import {writable} from 'svelte/store';
    import {goto} from "$app/navigation";

    let selection = "login";

    export const user = writable({
        psw: "",
        email: "",
        pswconf: "",
        username: ""
    })

    let client = getContextClient();

    function signup(e) {
        e.preventDefault()
        const MUT = gql`
        mutation Register(
          $email: String!
          $username: String!
          $password: String!
        ) {
          register(
            options: {
              username: $username
              email: $email
              password: $password
            }
          ) {
            user {
              id
              username
            }
            errors {
              message
            }
          }
        }

      `
        if ($user.psw == $user.pswconf) {
            const result = client.mutation(MUT, {email: $user.email, username: $user.username, password: $user.psw}).toPromise().then(res => {
                console.log(res)
                if(res.data.register.user){
                    goto("/usercontainer")
                }
                else{
                    alert("Reģistrēšanās neizdevās neizdevās")
                }
            })

        } else {
            alert("Nesakrīt paroles")
        }
    }
    function login(e) {
        e.preventDefault()
        const MUT = gql`
        mutation($email: String!, $password: String!) {
          login(options: {email: $email, password: $password}) {
            user{
              id
            }
            errors{
            field
            message
            }
          }
        }
      `
        client.mutation(MUT, {email: $user.email, password: $user.psw}).toPromise().then(res => {
            if(res.data.login.user){
                goto("/usercontainer")
            }
            else{
                alert("Ieiešana neizdevās")
            }
        })

    }
</script>


<div>
    <div class="selector">
        <button on:click={() => selection = "login"} class={selection == "login" ? "activebtn" : "btn"}>Pieslēgties
        </button>
        <button on:click={() => selection = "signup"} class={selection == "signup" ? "activebtn" : "btn"}>Reģistrēties
        </button>
    </div>
    {#if selection == "login"}
        <form on:submit={login}>
            <label for="email">E-pasts</label>
            <input type="email" id="email" bind:value={$user.email}>
            <label for="password">Parole</label>
            <input type="password" id="password" bind:value={$user.psw}>
            <input type="submit" value="Pieslēgties">
        </form>
    {/if}
    {#if selection == "signup"}
        <form on:submit={signup}>
            <label for="semail">E-pasts</label>
            <input type="email" id="semail" bind:value={$user.email}>
            <label for="username">Lietotājvārds</label>
            <input type="text" id="username" bind:value={$user.username}>
            <label for="spassword">Parole</label>
            <input type="password" id="spassword" bind:value={$user.psw}>
            <label for="pswconf">Parole vēlreiz</label>
            <input type="password" id="pswconf" bind:value={$user.pswconf}>
            <input type="submit" value="Reģistrēties">
        </form>
    {/if}
</div>

<style lang="scss">
  .selector {
    display: flex;
    padding: 10px;
    gap: 10px;

    .btn {
      padding: 10px;
      background-color: #a1a1a1;
      border: none;

    }

    .activebtn {
      padding: 10px;
      background-color: red;
    }
  }
</style>