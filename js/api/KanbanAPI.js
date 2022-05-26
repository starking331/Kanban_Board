export default class KanbanAPI {
	static getItems(columnId) {
		const column = read().find(column => column.id == columnId);

		if (!column) {
			return [];
		}

		return column.items;
	}

	static insertItem(columnId, content) {
		const data = read();
		const column = data.find(column => column.id == columnId);
		const item = {
			id: Math.floor(Math.random() * 100000),
			content
		};

		if (!column) {
			throw new Error("Column does not exist.");
		}

		column.items.push(item);
		save(data);

		return item;
	}


	static updateItems(itemId, value)
	{
		const data = read();
		const [item, currentColumn] = (() => {
			for (const column of data) {
				const item = column.items.find(item => item.id == itemId);

				if (item) {
					return [item, column];
				}
			}
		})();

		item.content = value;
	}
	static updateItem(itemId, newProps) {
		const data = read();
		const [item, currentColumn] = (() => {
			for (const column of data) {
				const item = column.items.find(item => item.id == itemId);

				if (item) {
					return [item, column];
				}
			}
		})();

		if (!item) {
			throw new Error("Item not found.");
		}

		item.content = newProps === undefined ? item.content : newProps;

		// Update column and position
		if (
			newProps.columnId !== undefined
			&& newProps.position !== undefined
		) {
			const targetColumn = data.find(column => column.id == newProps.columnId);

			if (!targetColumn) {
				throw new Error("Target column not found.");
			}

			// Delete the item from it's current column
			currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

			// Move item into it's new column and position
			targetColumn.items.splice(newProps.position, 0, item);
		}

		save(data);
	}

	static deleteItem(itemId) {
		const data = read();

		for (const column of data) {
			const item = column.items.find(item => item.id == itemId);

			if (item) {
				column.items.splice(column.items.indexOf(item), 1);
			}
		}

		save(data);
	}

	static addCol(item)
	{
		let input = {id: item.id, name: item.title ,items: []};
		const data = read();
		data.push(input);
		save(data);
	}

	static GetData(){
		const data = read();
		return data;
	}

	static deleteColumn(itemId) {
		const data = read();
		let newData = data;
		let item = false;
		let cnt = 0;
		let index = 0; 
		for (const column of data) {
			cnt++;
			if(column.id == itemId){
				item = true;
				index = cnt;
			}
		}
			if (item) {
				newData.splice(index-1,1);
			}

		save(newData);
	}
}

function read() {
	const json = localStorage.getItem("kanban-data");

	if (!json) {
		return [
			{
				id: 1,
				name: "Новые задачи",
				items: []
			},
			{
				id: 2,
				name: "В работе",
				items: []
			},
			{
				id: 3,
				name: "Завершены",
				items: []
			}
		];
	}

	return JSON.parse(json);
}

function save(data) {
	localStorage.setItem("kanban-data", JSON.stringify(data));
}
