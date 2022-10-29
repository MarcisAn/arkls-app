<script>
    import {writable} from "svelte/store";
    import {getContextClient, gql} from "@urql/svelte";
    import {goto} from "$app/navigation";

    let category = "school";
    export const task = writable({
        title: "",
        hours: 0
    })

    let client = getContextClient();

    function addTask(e) {
        e.preventDefault()
        console.log(category, $task)
        const MUT = gql`
        mutation PostTask(
          $title: String!
          $hours: Float!
          $category: String!
        ) {
          postTask(
            options: {
              title: $title
              hours: $hours
              category: $category
            }
          ){
          id
          }
        }

      `

        client.mutation(MUT, {
            title: $task.title,
            hours: $task.hours,
            category: category
        }).toPromise().then(res => {
            if(res.data.postTask){
                goto("/usercontainer/task/"+res.data.postTask.id)
            }
        })

    }


</script>

<h1>Pievienot uzdevumu</h1>


<form on:submit={addTask}>
    <label>Nosaukums
        <input type="text" bind:value={$task.title}>
    </label>
    <label>Pavadītais laiks(stundas)
        <input type="number" bind:value={$task.hours} step="0.1">
    </label>
    <label>Kategorija
        <div class="categories">

            <label>
                <input type="radio" group={category} name="category" value="school">

                Mācības
            </label>
            <label>
                <input type="radio" group={category} name="category" value="sports">

                Sports
            </label>
            <label>
                <input type="radio" group={category} name="category" value="pulcini">

                Pulciņi
            </label>
            <label>
                <input type="radio" group={category} name="category" value="hobbies">

                Hobiji
            </label>
            <label>
                <input type="radio" group={category} name="category" value="projects">

                Ilgtermiņa projekti
            </label>
            <label>
                <input type="radio" group={category} name="category" value="other">

                Cits
            </label>

        </div>

    </label>
    <input type="submit" value="Iesūtīt">
</form>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;

    .categories {
      display: flex;
      flex-direction: column;
    }
  }

</style>