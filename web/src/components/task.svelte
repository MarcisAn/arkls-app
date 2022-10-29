<script>
    import {getContextClient, gql} from '@urql/svelte';
    import { writable } from 'svelte/store';
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
          user{
          username

          }
          }
        }
      }
      `
    client.query(MUT, {
        id: "1"
    }).toPromise().then(res => {
        console.log(res)
    })
    const task = writable({
        username
    })
</script>

<p>{id}</p>