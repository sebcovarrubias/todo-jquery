$(document).ready(() => {

	let idIncrement = 1;
	let dbUsername = "";

	// Handle User Login
	$("#login-user").submit(event => {

		event.preventDefault();
		// remove error element in modal
		$("#login-modal .modal-footer").remove();

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
					password: password
				},

				success: data => {
					// Close modal
					$("#login-modal").modal("toggle");
					// Clear current tasks
					$("#tasks").html(`<h2 class="text-center">To Do</h2><br>`);
					// Clear completed tasks
					$(".done").html(`<h2 class="text-center">Done</h2>`);
					// Remove Login and Signup Buttons
					$("#login-button").hide();
					$("#signup-button").hide();
					// Set username as id in html
					$(".container").prepend(`<h1 class="text-center">Hi, ${data.username}!</h1>`);
					dbUsername = data.username;
					idIncrement = 1;
					// Populate DOM with tasks
					data.tasks.forEach(data => {
						// add task in html
						$("#tasks").append(`<div id="task-${idIncrement}" class="row ml-1">
							<label class="border border-secondary rounded col-10 mt-auto"><b>${data.task}</b></label>
							<input type="checkbox" value="${data.task}"></div>`);

						$(`#task-${idIncrement}`).find("input").addClass("form-control col-2 mt-1 mb-1");

						idIncrement++;
						
					});

				},

				error: (xhr, err) => {
					// Create DOM element in modal for error
					$("#login-modal .modal-content").append(`<div class="modal-footer"><h4 class="text-danger">Login Error</h4></div>`);
				}
			});

		}

	});

	// Handle User Sign Up
	$("#signup-user").submit(event => {

		event.preventDefault();
		// remove error element in modal
		$("#signup-modal .modal-footer").remove();

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
					// Close modal
					$("#signup-modal").modal("toggle");
					// Clear current tasks
					$("#tasks").html(`<h2 class="text-center">To Do</h2><br>`);
					// Clear completed tasks
					$(".done").html(`<h2 class="text-center">Done</h2>`);
					// Remove Login and Signup Buttons
					$("#login-button").hide();
					$("#signup-button").hide();
					// Set username as id in html
					$(".container").prepend(`<h1 class="text-center">Hi, ${data}!</h1>`);
					dbUsername = data;
					idIncrement = 1;
				},

				error: (xhr, err) => {
					// Create DOM element in modal for error
					$("#signup-modal .modal-content").append(`<div class="modal-footer"><h4 class="text-danger">Sign Up Error</h4></div>`);
				}
			});

		}

	});

	// Send a new task to the server
	$("#add-task").submit(event => {

		event.preventDefault();

		// if not logged in, no server requests needed
		if (!dbUsername && $("#add")[0].value) {
			// add task in html
			$("#tasks").append(`<div id="task-${idIncrement}" class="row ml-1">
				<label class="border border-secondary rounded col-10 mt-auto"><b>${$("#add")[0].value}</b></label>
				<input type="checkbox" value="${$("#add")[0].value}"></div>`);
			// clear task input
			$("#add").val("");

			$(`#task-${idIncrement}`).find("input").addClass("form-control col-2 mt-1 mb-1");

			idIncrement++;

		// if logged in
		} else if ( $("#add")[0].value ) {

			$.ajax({
				type: "POST",
				url: "/api/add",
				data: {
					username: dbUsername,
					task: $("#add")[0].value
				},

				success: data => {
					// clear task input
					$("#add").val("");
					// add task in html
					$("#tasks").append(`<div id="task-${idIncrement}" class="row ml-1">
						<label class="border border-secondary rounded col-10 mt-auto"><b>${data}</b></label>
						<input type="checkbox" value="${data}"></div>`);

					$(`#task-${idIncrement}`).find("input").addClass("form-control col-2 mt-1 mb-1");

					idIncrement++;
					// remove previous error DOM if present
				},

				error: (xhr, err) => {
					// add error DOM on unsuccessful add task request
				}
			});
		}
		
	});

	// Send task completion to the server
	$("#current-tasks").submit(event => {

		event.preventDefault();
		let newData = [];

		$.each($("input:checked"), (i, data) => {

			newData.push({
				id: $(data).parent()[0].id,
				value: data.value
			});

		});

		// if not logged in, no server requests needed
		if (!dbUsername && newData.length) {

		} else if (newData.length) {

			$.ajax({
				type: "POST",
				url: "/api/complete",
				data: {data: newData},

				success: data => {
					// move tasks to completed area
					$.each(data, (i, task) => {
						// hide task from current tasks area
						$(`#${task.id}`).hide();
						// set html to empty (save for id purposes)
						$(`#${task.id}`).html("");
						// add task in html
						$(".done").append(`<div class="border rounded ml-1 mr-1 mb-1"><b class="ml-1">${task.value}</b></div>`);
						
					});
				}
			});

		}

	});

});