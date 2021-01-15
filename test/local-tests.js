let chai = require('chai');
let assert = chai.assert;
let Browser = require('zombie');

Browser.localhost("todo.com", 3000);

describe("Local Test Suite", () => {

	let browser = new Browser();

	before(done => {
		return browser.visit("/", done);
	});

	describe("Adding a task", () => {

		before(done => {

			browser.fill("add", "test");
			return browser.pressButton("#send-task", done);

		});

		it("Adds the correct task id to the DOM element", () => {

			browser.assert.element("#task-1", 1);
			
		});

		it ("Contains the correct Task text value", () => {

			browser.assert.text("#task-1 label b", "test");

		});

		before(done => {

			browser.fill("add", "test2");
			browser.pressButton("#send-task", () => {

				browser.fill("add", "test3");
				browser.pressButton("#send-task", () => {

					browser.fill("add", "test4");
					return browser.pressButton("#send-task", done);
				});
			});

		});

		it ("Increments the Task id properly in the DOM", () => {

			browser.assert.element("#task-1", 1);
			browser.assert.element("#task-2", 1);
			browser.assert.element("#task-3", 1);
			browser.assert.element("#task-4", 1);

		});

		it ("Contains the correct Task text value (after first insertion)", () => {

			browser.assert.text("#task-1 label b", "test");
			browser.assert.text("#task-2 label b", "test2");
			browser.assert.text("#task-3 label b", "test3");
			browser.assert.text("#task-4 label b", "test4");

		});

	});

	describe("Removing a task", () => {

		before(done => {
			browser.check("#task-1 input");
			return browser.pressButton("#complete-task", done);
		});

		it ("Removes the element from the current Task area", () => {

			browser.assert.elements("#task-1 label", 0);
			browser.assert.elements("#task-1 b", 0);
			browser.assert.elements("#task-1 input", 0);

		});

		it ("Creates a new element in the completed Task area", () => {

			browser.assert.elements(".completed-task", 1);
		});


		describe ("Removing multiple tasks", () => {

			before(done => {
				browser.check("#task-2 input", () => {
					browser.check("#task-3 input", () => {
						return browser.pressButton("#complete-task", done);
					});
				});

			});

			it("Removes multiple tasks from the current Task area", () => {

				browser.assert.elements("#task-2 label", 0);
				browser.assert.elements("#task-2 b", 0);
				browser.assert.elements("#task-2 input", 0);

				browser.assert.elements("#task-3 label", 0);
				browser.assert.elements("#task-3 b", 0);
				browser.assert.elements("#task-3 input", 0);
			});

			it("Doesn't remove tasks that weren't selected", () => {

				browser.assert.elements("#task-4 label", 1);
				browser.assert.elements("#task-4 b", 1);
				browser.assert.elements("#task-4 input", 1);
			});

			it ("Creates new elements in the completed Task area for selected tasks only", () => {
				browser.assert.elements(".completed-task", 3);
			});

		});

	});	

});
