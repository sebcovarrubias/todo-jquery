$(document).ready(() => {

	// Handle User Login
	$("#login-user").submit(event => {

		event.preventDefault();

		let username = $("#login-username")[0].value;
		let password = $("#login-password")[0].value;

		$("#login-username").val("");
		$("#login-password").val("");

		if ( username && password ) {

			$.ajax({
				type: "POST",
				url: "/api/login",

				data: {
					username: username,
					password:password
				},

				success: data => {
					console.log("success");
				},

				error: (xhr, err) => {
					console.log(err);
				}
			});

		}

	});

	// Handle User Sign Up
	$("#signup-user").submit(event => {

		event.preventDefault();

		let username = $("#signup-username")[0].value;
		let password = $("#signup-password")[0].value;

		$("#signup-username").val("");
		$("#signup-password").val("");

		if ( username && password ) {

			$.ajax({
				type: "POST",
				url: "/api/signup",

				data: {
					username: username,
					password: password
				},

				success: data => {
					console.log("success");
				},

				error: (xhr, err) => {
					console.log(err);
				}
			});

		}

	});

	let idIncrement = 1;

	// send a new task to the server
	$("#add-task").submit(event => {

		event.preventDefault();

		if ( $("#add")[0].value ) {

			$.ajax({
				type: "POST",
				url: "/api/add",
				data: {data:$("#add")[0].value },

				success: data => {
					$("#add").val("");

					$(".tasks").append(`<div id="task-${idIncrement}" class="row ml-1">
						<label class="border border-secondary rounded col-10 mt-auto"><b>${data}</b></label>
						<input type="checkbox" value="${data}"></div>`);
					$(`#task-${idIncrement}`).find("input").addClass("form-control col-2 mt-1 mb-1");

					idIncrement++;
				}
			});
		}
		
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
				$.each(data, (i, task) => {
					$(`#${task.id}`).hide();

					$(`#${task.id}`).html("");

					$(".done").append(`<div class="border rounded ml-1 mr-1 mb-1"><b class="ml-1">${task.value}</b></div>`);
					
				});
			}
		});

	});

});