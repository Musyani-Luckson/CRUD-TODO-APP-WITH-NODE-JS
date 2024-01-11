// 
import { Utilities } from "../modules/utilities.js"
const utilities = new Utilities();
// 
function fetchData(apiUrl, configs) {
    return fetch(apiUrl, configs)
        .then(response => {
            return response.json();
        })
        .catch(error => {
            return error;
        })
}
// 
class ToDo {
    #myForm = utilities.getDom(`#myForm`);
    #maxTodos = utilities.getDom(`#maxTodos`);
    #form = utilities.getDom(`#inputData`);
    #toDosBox = utilities.getDom(`#toDos`);
    //
    #myToDos = [{}];
    #KEY = `myToDos`;
    //
    #toDosSize() {
        return utilities.getProps(this.#myToDos[0], `keys`).length;
    };
    //
    #reloadRecords() {
        const url = `/todos`;
        read(url, results => {
            this.#myToDos = results;
            utilities.setInnerText(this.#maxTodos, `${this.#toDosSize()} Todos`);
            this.#displayToDos();
        })
    };
    //
    #id(items) {
        const ID = utilities.idGenerator();
        if (items[ID] == undefined) {
            return ID;
        } else {
            this.#id(items);
        }
    }
    //
    #addToDos(value) {
        const url = `/todos`;
        const ID = this.#id(this.#myToDos[0]);
        const DATA = {
            text: value,
            id: ID,
            timeStamp: new Date().toString()
        };
        create(url, DATA, (response) => {
            const { status, statusCode, data } = response;
            if (status) {
                this.#reloadRecords();
            }
        })
    }
    //
    #handleAddBtn() {
        utilities.handleEvent(this.#myForm, `submit`, event => {
            event.preventDefault();
            const formData = new FormData(this.#myForm)
            const VALUE = formData.get(`todo`).trim();
            if (VALUE == "" && VALUE.length == 0) {
                alert("CANNOT SET NOTHING TO DO")
            } else {
                this.#form.value = ``;
                this.#addToDos(VALUE);
            }
        })
    };
    //
    #displayToDos() {
        const TODOS = utilities.getProps(this.#myToDos[0], `values`)
        utilities.removeElement(this.#toDosBox)
        const parent = utilities.setDom(`div`, {
            class: `parent`,
        })
        for (let i = 0; i < TODOS.length; i++) {
            const CARD = this.#toDoCard(TODOS[i]);
            parent.appendChild(CARD.outerComp);
            this.#manageRecords(i, CARD)
        }
        this.#toDosBox.appendChild(parent);
    };
    //
    #toDoCard(data) {
        const rightBtnComp = utilities.setDom(`button`, {
            "data-id": data.id,
            class: `border`,
            value: `delete`,
            data: {
                text: `DELETE`
            }
        })
        // 
        const leftBtnComp = utilities.setDom(`button`, {
            "data-id": data.id,
            class: `border`,
            value: `edit`,
            data: {
                text: `EDIT`
            }
        })
        // 
        const leftComp = utilities.setDom(`input`, {
            class: `form-control border`,
            type: `text`,
            disabled: true
        })
        leftComp.value = data.text;
        // 
        const outerComp = utilities.setDom(`li`, {
            class: `input-group rounded item`,
            data: {
                append: [
                    leftComp,
                    leftBtnComp,
                    rightBtnComp
                ]
            }
        })
        // 
        return {
            outerComp,
            leftBtn: leftBtnComp,
            rightBtn: rightBtnComp,
            form: leftComp,
            id: data.id
        };
    }
    //
    #back(card) {
        card.form.disabled = true;
        utilities.setInnerText(card.leftBtn, `EDIT`);
        card.leftBtn.value = `edit`;
        utilities.setInnerText(card.rightBtn, `DELETE`);
        card.rightBtn.value = `delete`;
    }
    //
    #manageRecords(index, card) {
        const { rightBtn, leftBtn, form, id } = card
        utilities.handleEvent(leftBtn, `click`, (event) => {
            const VALUE = leftBtn.value;
            if (VALUE == `edit`) {
                form.disabled = false;
                utilities.setInnerText(leftBtn, `UPDATE`);
                leftBtn.value = `update`;
                utilities.setInnerText(rightBtn, `BACK`);
                rightBtn.value = `back`;
            } else {
                const FORM_VALUE = form.value;
                this.#back(card);
                this.#myToDos[0][id].text = FORM_VALUE;
                const edited = this.#myToDos[0][id];
                const url = `/todos/${id}`
                update(url, edited, response => {
                    const { status, statusCode, data } = response;
                    if (status) {
                        // this.#reloadRecords();
                    }
                })
            }
        })
        //
        utilities.handleEvent(rightBtn, `click`, () => {
            const VALUE = rightBtn.value;
            if (VALUE == `delete`) {
                // const id = rightBtn.dataset.id;
                const url = `/todos/${id}`
                deleteTodo(url, response => {
                    const { status, statusCode, data } = response;
                    if (status) {
                        this.#reloadRecords();
                    }
                })
            } else {
                this.#back(card);
                form.value = this.#myToDos[0][card.id].text;
            }
        })
    }
    //
    run() {
        this.#reloadRecords();
        this.#handleAddBtn();

    };
}
// GET
function read(apiUrl, callback) {
    const configs = {
        method: `GET`,
    }
    fetchData(apiUrl, configs).then(data => {
        return callback(data)
    })
}
// POST
function create(apiUrl, body = {}, callback) {
    const configs = {
        method: `POST`,
        headers: {
            'Content-Type': `application/json`
        },
        body: JSON.stringify(body)
    }
    fetchData(apiUrl, configs).then(data => {
        return callback(data)
    })
}
// // PUT
function update(apiUrl, body = {}, callback) {
    const configs = {
        method: `PUT`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(body)
    }
    fetchData(apiUrl, configs).then(data => {
        return callback(data)
    })
}
// DELETE
function deleteTodo(apiUrl, callback) {
    const configs = {
        method: `DELETE`,
    }
    fetchData(apiUrl, configs).then(data => {
        return callback(data)
    })
}
const TODOS = new ToDo()
TODOS.run();