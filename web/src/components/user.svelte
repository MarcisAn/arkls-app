<script>
    import {getContextClient, gql} from "@urql/svelte";

    export let username = "";
    export let isFriend = false;
    let isSelf = false;

    const handleError = ev => ev.target.src = "http://localhost:5173/assets/defaultPFP.png"
    const client = getContextClient()
    if (isFriend == null) {
        const isFriendQ = gql`
        query($username:String!) {
            isFriend(options: {
                username: $username
            }
            )
        }
      `
        client.query(isFriendQ, {
            username: username
        }).toPromise().then(res => {
            if (res.data) {
                if (res.data.isFriend) {
                    isFriend = true;
                } else {
                    isFriend = false;
                }
            }
            if (res.data == null) {
                isSelf = true;
            }


        })
    }

    function addFriend() {
        const MUT = gql`
        mutation($username: String!) {
          addFriend(options: {username: $username})
        }
      `
        client.mutation(MUT, {username: username}).toPromise().then(res => {
            if (res.data.addFriend) {
                isFriend = !isFriend;
            }
        })

    }
</script>

<div class={"userCard"} class:selected={isFriend}>
    <img src={"https://arkls-api.cvgmerch.lv/pfp?username=" + username} alt="" on:error={handleError}>
    <p>{username}</p>
    {#if !isSelf}
        <button on:click={() => addFriend()}>{isFriend ? "Pārtraukt draudzēties" : "Draudzēties"}</button>
    {/if}
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

  .selected {
    background-color: #34638F;
  }


</style>