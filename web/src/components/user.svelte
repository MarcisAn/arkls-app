<script>
    import {getContextClient, gql} from "@urql/svelte";
    import {goto} from "$app/navigation";

    export let username = "";
    const handleError = ev => ev.target.src = "http://localhost:5173/assets/defaultPFP.png"

    function addFriend(e) {
        e.preventDefault()
        const MUT = gql`
        mutation($username: String!) {
          addFriend(options: {username: $username})
        }
      `
        const client = getContextClient()
        client.mutation(MUT, {username: "2"}).toPromise().then(res => {
            console.log(res)
        })

    }
</script>

<div class="userCard">
    <img src={"http://localhost:4000/pfp?username=" + username} alt="" on:error={handleError}>

    <p>{username}</p>
    <button on:click={addFriend}>Draudzēties</button>
</div>

<style lang="scss">
  .userCard {
    background-color: #ffa042;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1em;

    img {
      border-radius: 100%;
      width: 50px;
    }

    p {
      font-size: x-large;
      font-weight: bold;
    }

    button {
      margin-left: auto;
    }
  }


</style>