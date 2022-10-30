<script>
    import Task from "../../../../components/task.svelte"
    import { page } from '$app/stores';
</script>

<Task id={$page.params.id}/>