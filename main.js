
let items = []
let progress = document.querySelector("progress")


document.addEventListener("DOMContentLoaded", () =>{
	const ul = document.querySelector("#calories-list")
	ul.innerHTML = ""
	progress = document.querySelector("progress")

	const add_form = document.querySelector("#new-calorie-form")
	add_form.addEventListener("submit", e => {
		e.preventDefault()
		let cals = e.target[0].value
		let note = e.target[1].value
		add_new_item(cals, note)
	})

	const form = document.querySelector("#bmr-calulator")
	form.addEventListener("submit", e => {
		e.preventDefault()
		let weight = e.target[0].value
		let height = e.target[1].value
		let age = e.target[2].value
		let lower = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age )
		let high = 66 + (6.23 * weight) + (12.7 * height ) - (6.8 * age )
		const lspan = document.querySelector("#lower-bmr-range")
		lspan.innerText = lower
		const hspan = document.querySelector("#higher-bmr-range")
		hspan.innerText = high
		progress.setAttribute("max", (high + lower)/2)

	})

	fetch("http://localhost:3000/api/v1/calorie_entries")
	.then(res => res.json())
	.then(json =>{
		// console.log(json)
		items = json
		generate_list()
		
	})


})

function get_sum(items) {
	let sum = 0
	items.forEach(item => {
		sum += parseInt(item.calorie)
	})
	console.log(sum)
	return sum
	
}
function add_item(item) {
	const li = document.createElement("li")
	li.className = "calories-list-item"
	li.innerHTML = ` <div class="uk-grid">  <div class="uk-width-1-6"> <strong>${item.calorie}</strong> 
	<span>kcal</span> </div> <div class="uk-width-4-5"> 
	<em class="uk-text-meta">${item.note}</em> </div> </div> <div class="list-item-menu"> 
	<a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a> 
	<a class="delete-button" uk-icon="icon: trash"></a> </div> `

	const del_btn = li.children[1].children[1]
	del_btn.addEventListener("click", () => {
		li.remove()
		remove_item(item)

	})
	const edit_btn = li.children[1].children[0]
	edit_btn.addEventListener("click", () => {
		//document.querySelector("#edit-form-container").hidden = false

		const edit_form = document.querySelector("#edit-calorie-form")
		console.log(edit_form.children[1].children[0].children[0])
		edit_form.children[1].children[0].children[0].value = item.calorie
		edit_form.children[1].children[1].children[0].value = item.note


		edit_form.addEventListener("submit", e => {
			//document.querySelector("#edit-form-container").on('hide.bs.modal', function (e) {
				e.preventDefault()
				item.calorie = e.target[0].value
				item.note = e.target[1].value
				update_item(item)
				console.log(e)
			//})
		})

	})
	return li
}
function remove_item(item) {
	fetch(`http://localhost:3000/api/v1/calorie_entries/${item.id}`, {method:"DELETE"})
	.then(res => res.json())
	.then(json => {
		items = items.filter(u => u.id != item.id);
		generate_list()
	})


}

function generate_list() {
	const ul = document.querySelector("#calories-list")
	ul.innerHTML = ""
	items.forEach(item => {
		ul.append(add_item(item))
	})
	progress.setAttribute("value", get_sum(items))

}

function add_new_item(cals, note) {
	
	fetch("http://localhost:3000/api/v1/calorie_entries", {
		method:"POST",
		headers:{
			"Content-Type": "application/json",
			 Accept: "application/json"
		},
		body:JSON.stringify({
			"calorie": cals,
			"note": note
		})
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		items.unshift(json)
		generate_list()
	})
}


function update_item(item) {
	
	fetch(`http://localhost:3000/api/v1/calorie_entries/${item.id}`, {
		method:"PATCH",
		headers:{
			"Content-Type": "application/json",
			 Accept: "application/json"
		},
		body:JSON.stringify({
			"calorie": item.calorie,
			"note": item.note
		})
	})
	.then(res => res.json())
	.then(json => {
		items.forEach(i => {
		if (i.id == item.id){
			i.cals = item.cals
			i.note = item.note
			generate_list()
		}
	})
	})
		

}








