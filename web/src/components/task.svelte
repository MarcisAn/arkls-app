<script>
    import {getContextClient, gql} from '@urql/svelte';
    import {writable} from 'svelte/store';
    import User from "./user.svelte"

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
    function categoryName(name){
        switch (name){
            case "school":
                return "Skola"
                break;
        }
    }
</script>


<div class="task">
    <h1>{$task.title}</h1>

    <User username={$task.username} isFriend={null}/>
    <div class="taskInfo">
        <p>{$task.points}</p>
        <p>{$task.category}</p>
    </div>
    <img src={"http://localhost:4000/taskpic?id=" + $task.id} alt="Task picture">
</div>

<style lang="scss">
  .task {
    .taskInfo {
      background-color: #3C3084;
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

    .userCard {
      margin: 1em;
      background-color: red !important;
      border: #68dc68 2px solid;
    }
  }
</style>