$(document).ready(() => {

	let idIncrement = 1;

	// send a new task to the server
	$("#add-task").submit(event => {

		event.preventDefault();

		$.ajax({
			type: "POST",
			url: "/api/add",
			data: {data:$("#add")[0].value},
			success: data => {
				$("#add").val('');
				$("#complete-button").before(`<div id="task-${idIncrement}"><label>${data}</label>
					<input type="checkbox" value="${data}"></div>`);
				idIncrement++;
			}
		});
		
	});

	// POST request on task completion
	$("#current-tasks").submit(event => {

		event.preventDefault();
		let newData = [];

		$.each($("input:checked"), (i, data) => {

			newData.push({
				id: $(data).parent()[0].id,
				value: data.value
			});

		});

		$.ajax({
			type: "POST",
			url: "/api/complete",
			data: {data: newData},
			success: data => {
				// move tasks to completed area
				data.forEach(task => {
					$(`<div id="${task.id}">${task.value}</div>`).appendTo(".done");
					$(`#${task.id}`).remove();
					idIncrement--;
				});
			}
		});

	});

});