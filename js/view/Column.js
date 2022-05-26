import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./DropZone.js";
import Item from "./Item.js";

export default class Column {
	constructor(id, title) {
		const topDropZone = DropZone.createDropZone();

		this.elements = {};
		this.elements.root = Column.createRoot();
		this.elements.title = this.elements.root.querySelector(".kanban__column-title");
		this.elements.items = this.elements.root.querySelector(".kanban__column-items");
		this.elements.addItem = this.elements.root.querySelector(".kanban__add-item");
		this.elements.delColumn = this.elements.root.querySelector(".delColumn");

		this.elements.root.dataset.id = id;
		this.elements.title.textContent = title;
		this.elements.items.appendChild(topDropZone);

		this.elements.addItem.addEventListener("click", () => {
			const newItem = KanbanAPI.insertItem(id, "");

			this.renderItem(newItem);
		});

		this.elements.delColumn.addEventListener("click", () => {
			const check = confirm("Are you sure you want to delete this item?");

			if (check) {
				KanbanAPI.deleteColumn(id);
			}

			window.location.reload();

		});

		KanbanAPI.getItems(id).forEach(item => {
			this.renderItem(item);
		});

	}


	static createRoot() {
		const range = document.createRange();

		range.selectNode(document.body);

		return range.createContextualFragment(`
			<div class="kanban__column">
			<button id="delBtn" class="delColumn"><img src="img/X.png" alt="X" width="15px" height="15px"></button>
				<div class="kanban__column-title"></div>
				<div class="kanban__column-items"></div>
				<button class="kanban__add-item" type="button">+ Add</button>
			</div>
		`).children[0];
	}


	renderItem(data) {
		const item = new Item(data.id, data.content);

		this.elements.items.appendChild(item.elements.root);
	}
}
