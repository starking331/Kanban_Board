import DropZone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class Item {
	constructor(id, content) {
		const bottomDropZone = DropZone.createDropZone();


		this.elements = {};
		this.elements.root = Item.createRoot();
		this.elements.input = this.elements.root.querySelector(".kanban__item-input");
		

		this.elements.root.dataset.id = id;
		this.elements.input.textContent = content;
		this.content = content;
		this.elements.root.appendChild(bottomDropZone);
		this.elements.delItem = this.elements.root.querySelector(".delBtn");

		this.elements.delItem.addEventListener("click", () => {
			const check = confirm("Are you sure you want to delete this item?");

			if (check) {
				KanbanAPI.deleteItem(id);


				this.elements.root.parentElement.removeChild(this.elements.root);
			}
		});



		this.elements.root.addEventListener("input", e => {
			KanbanAPI.updateItem(id, this.elements.input.textContent);
		});


		this.elements.root.addEventListener("dragstart", e => {
			e.dataTransfer.setData("text/plain", id);
		});

		this.elements.input.addEventListener("drop", e => {
			e.preventDefault();
		});
	}

	static createRoot() {
		const range = document.createRange();

		range.selectNode(document.body);

		return range.createContextualFragment(`
			<div class="kanban__item" draggable="true">
				<button id="delBtn" class="delBtn"><img src="img/X.png" alt="X" width="15px" height="15px"></button>
				<div class="kanban__item-input" contenteditable="true">
				</div>
			</div>
		`).children[0];
	}
}
