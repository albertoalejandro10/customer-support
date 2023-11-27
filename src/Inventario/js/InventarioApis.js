import { getParameter } from "../../jsgen/Helper"
import { get_deposits } from "../../jsgen/Apis-Helper"

const get_rubros = tkn => {
	const combo_configs = {
		allowClear: true,
		placeholder: 'Buscar rubro',
		ajax: {
		delay: 500,
		url: process.env.Solu_externo + '/listados/productos/get_rubros',
		headers: {'Authorization' : 'Bearer ' + tkn},
		type: 'GET',
		dataType: 'json',
		data: (params) => ({ search: params.term || '', type: 'public' }),
		processResults: (data, params) => {
			const searchTerm = params.term && params.term.toLowerCase()
			const results = searchTerm 
				? data.map(({ id, nombre }) => ({
					id: id,
					text: nombre
				})).filter(result => result.text.toLowerCase().includes(searchTerm))
				: data.map(({ id, nombre }) => ({
					id: id,
					text: nombre
				}))
			
			return { results }
			}
		}
	}

	$("#entry").select2(combo_configs)
	.on('select2:open', () => $(".select2-search__field")[0].focus())
	.on("select2:close", () => {
		if ($(".select2-search__field").val() === "") {
			$("#entry").select2("search", "")
		}
	})
	.on("select2-clearing", () => { $(this).val(null).trigger("change") })
}

const get_salesLine = tkn => {
	const combo_configs = {
		allowClear: true,
		placeholder: 'Buscar línea',
		ajax: {
			delay: 500,
			url: process.env.Solu_externo + '/listados/productos/get_lineas',
			headers: {'Authorization' : 'Bearer ' + tkn},
			type: 'GET',
			dataType: 'json',
			data: (params) => ({ search: params.term || '', type: 'public' }),
			processResults: (data, params) => {
				const searchTerm = params.term && params.term.toLowerCase()
				let results = searchTerm 
					? data.map(({ id, nombre }) => ({
						id: id,
						text: nombre
					})).filter(result => result.text.toLowerCase().includes(searchTerm))
					: data.map(({ id, nombre }) => ({
						id: id,
						text: nombre
					}))
				
				// Si no hay resultados, muestra todos los resultados
				if (results.length === 0) {
					results = data.map(({ id, nombre }) => ({
						id: id,
						text: nombre
					}))
				}
				
				return { results }
			}
		}
	}

	$("#sale-line").select2(combo_configs)
	.on('select2:open', () => {
		$(".select2-search__field")[0].focus()
		// Agrega un evento de escucha para el evento 'input'
		$(".select2-search__field")[0].addEventListener('input', (event) => {
			// Si el campo de búsqueda está vacío, realiza una nueva búsqueda para obtener todos los resultados
			if (event.target.value === "") {
				$("#sale-line").select2("search", "")
			}
		})
	})
	.on("select2:close", () => {
		if ($(".select2-search__field").val() === "") {
			$("#sale-line").select2("search", "")
		}
	})
	.on("select2-clearing", () => { $(this).val(null).trigger("change") })
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
	get_rubros( tkn )
	get_salesLine( tkn )
	get_deposits( tkn )
}

const today = new Date().toLocaleDateString('en-GB')
const date = today.split('/').reverse().join('-')
const dateElement = document.getElementById('to-date')
dateElement.value = date