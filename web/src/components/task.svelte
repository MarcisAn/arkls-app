<script>
    import {getContextClient, gql} from '@urql/svelte';
    import {writable} from 'svelte/store';
    import User from "./user.svelte"
    import {dev} from "$app/environment";

    export let id = 0;
    const client = getContextClient()
    const MUT = gql`
        query($id:String!) {
        getTask(options: {
            id: $id
        }) {
        task{
          id
          title
          points
          category
          user{
            username
          }
          comments{
            user{
            username

          }
            text
          }
          }
        }
      }
      `

    client.query(MUT, {
        id: id
    }).toPromise().then(res => {
        console.log(res)
        //client.query(isFriendMUT, {
        //    username: res.data.getTask.task.user.username
        //}).toPromise().then(friendRes => {
        //    console.log(friendRes)
        //    if (friendRes.data) {
//
        //    } else {
        //        console.log(res.error)
        //    }
        if (res.data) {
            task.set({
                id: res.data.getTask.task.id,
                points: res.data.getTask.task.points,
                title: res.data.getTask.task.title,
                username: res.data.getTask.task.user.username,
                category: res.data.getTask.task.category,

            })
        } else {
            console.log(res.error)
        }
        //})


    })
    const task = writable({
        username: "",
        title: "",
        points: 0,
        isFriend: true,
        id: 0,
        category: ""
    })

    function categoryName(name) {
        switch (name) {
            case "school":
                return ["Skola", "#4a8137"]
                break;
            case "sports":
                return ["Sports", "#3773b7"]
                break;
            case "pulcini":
                return ["Pulciņi", "#c44545"]
                break;
            case "hobbies":
                return ["Hobiji", "#c57b2f"]
                break;
            case "projects":
                return ["Projekti", "#6ed9d9"]
                break;
            case "other":
                return ["Cits", "#e0a05d"]
                break;
        }
    }
</script>


<div class="task">
    <h1>{$task.title}</h1>

    <User username={$task.username} isFriend={null}/>
    {#if $task.id}
        <div class="taskInfo">
            <div class="points">
                TUPEŅI
                <span>
                    {$task.points}
                </span>
            </div>
            <div class="category">
                KATEGORIJA:
                <span style={"background-color: "+ categoryName($task.category)[1]}>{categoryName($task.category)[0]}</span>
            </div>
        </div>
        <div class="taskImage">
            {#if dev}
                <img src={"http://localhost:4000/taskpic?id=" + $task.id} alt="">
            {/if}
            {#if !dev}
                <img src={"https://arkls-api.cvgmerch.lv/taskpic?id=" + $task.id} alt="">
            {/if}
        </div>
        <div class="comments">
            <h2>Komentāri:</h2>
        </div>
    {/if}
</div>

<style lang="scss">
  .task {
    .taskInfo {
      margin-top: 1em;
      .points {
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: #244564;

        span {
          margin-left: 10px;
          padding: 10px;
          color: black;
          background-color: white;
        }

        color: white;
        padding: 10px;
        border-radius: 10px;
      }

      .category {
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: #244564;

        span {
          margin-left: 10px;
          padding: 10px;
          color: black;
        }

        color: white;
        padding: 10px;
        border-radius: 10px;
      }

      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    margin: 1em;
    background-color: #a1a1a1;
    padding: 1em;

    img {
      margin: auto;
      width: 70%; /* or any custom size */
      height: 100%;
      object-fit: contain;
    }

    h1 {
      font-size: xx-large;
    }

    .taskImage {
      margin-top: 1em;
      display: flex;
      justify-items: center;
    }

    .userCard {
      margin: 1em;
      background-color: red !important;
      border: #68dc68 2px solid;
    }
  }
</style>