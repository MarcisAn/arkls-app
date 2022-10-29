<script>
    import {getContextClient, gql} from "@urql/svelte";
    import {goto} from "$app/navigation";

    export let username = "";
    export let isFriend = false;

    const handleError = ev => ev.target.src = "http://localhost:5173/assets/defaultPFP.png"
    const client = getContextClient()

    function addFriend() {
        const MUT = gql`
        mutation($username: String!) {
          addFriend(options: {username: $username})
        }
      `
        client.mutation(MUT, {username: username}).toPromise().then(res => {
            if(res.data.addFriend){
                console.log("veiksmigi")
                isFriend = !isFriend;
            }
        })

    }
</script>

<div class={"userCard"} class:selected={isFriend}>
    <img src={"http://localhost:4000/pfp?username=" + username} alt="" on:error={handleError}>
    <p>{username}</p>
    <button on:click={() => addFriend()}>{isFriend ? "Pārtraukt draudzēties":"Draudzēties"}</button>
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
  .selected{
    background-color: #0077ff;
  }


</style>