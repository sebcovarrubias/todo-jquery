$(document).ready(() => {
	// Create an empty list of tasks
	let tasks = [];

	// send a new task to the server
	$("form").submit(event => {

		event.preventDefault();

		$.ajax({
			type: "POST",
			url: "/add",
			data: {data:$("#add")[0].value},
			success: data => {
				$("#add").val('');
				tasks.push(data);
			}
		});
		
	});

	// // Add checkboxes to submit a POST request when tasks are done

	// // show completed tasks

});