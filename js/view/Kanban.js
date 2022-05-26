import Column from "./Column.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class Kanban {
	constructor(root) {
		this.a = [];
		this.root = root;
		this.addColumn = this.root.querySelector(".addColumn");



		KanbanAPI.GetData().forEach(item => {
			this.a.push(item);
		});

		this.addColumn.addEventListener("click", () => {
			let name = prompt('Название колонки', "Дела");
			let input = new Column(KanbanAPI.GetData().length + 1, name);
			let objInput = {id: KanbanAPI.GetData().length + 1, title: name};
			KanbanAPI.addCol(objInput);
			Kanban.columns(this.a);
			this.a.push(objInput);
			this.root.appendChild(input.elements.root);
		});



		Kanban.columns(this.a).forEach(column => {
			const columnView = new Column(column.id, column.name);
			this.root.appendChild(columnView.elements.root);
		});
	}

	

	static columns(a) {
		return a;
	}
}
