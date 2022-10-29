<script>
    import Task from "../../../../components/task.svelte"
    import { page } from '$app/stores';
</script>

<h1>cav</h1>
<Task id={$page.params.id}/>