import { getParameter } from "../../jsgen/Helper"
import { get_startMonth } from "../../jsgen/Apis-Helper"

const get_customers = tkn => {
	const combo_configs = {
		width: 'element',
		dropdownAutoWidth: true,
		allowClear: true,
		placeholder: 'Buscar cliente',
		ajax: {
			delay: 500,
			url: process.env.Solu_externo + '/listados/get_clientes',
			headers: {'Authorization' : 'Bearer ' + tkn},
			type: 'GET',
			dataType: 'json',
			data: (params) => ({ search: params.term || '', type: 'public' }),
			processResults: (data, params) => {
				data.unshift({
					codCliente: '0',
					nombre: 'Todos'
				})
				const searchTerm = params.term && params.term.toLowerCase()
				const results = searchTerm 
					? data.map(({ codCliente, cuit, nombre, id }) => ({
						id: codCliente,
						text: nombre
					})).filter(result => result.text.toLowerCase().includes(searchTerm))
					: data.map(({ codCliente, cuit, nombre, id }) => ({
						id: codCliente,
						text: nombre
					}))
				
				return { results }
			}
		}
	}

	$("#customers").select2(combo_configs)
	.on('select2:open', () => $(".select2-search__field")[0].focus())
	.on("select2:close", () => {
		if ($(".select2-search__field").val() === "") {
			$("#customers").select2("search", "")
		}
	})
	.on("select2-clearing", () => { $(this).val(null).trigger("change") })
}

const get_products = tkn => {
	const combo_configs = {
		width: 'element',
		dropdownAutoWidth: true,
		allowClear: true,
		placeholder: 'Buscar producto',
		ajax: {
			delay: 500,
			url: process.env.Solu_externo + '/listados/get_productos_filtro',
			headers: {'Authorization' : 'Bearer ' + tkn},
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				"filtro": ""
			}),
			processResults: (data, params) => {
				data.unshift({
					codigo: ' ',
					detalle: 'Todos',
					unidad: ''
				})
				const searchTerm = params.term && params.term.toLowerCase()
				const results = searchTerm 
					? data.map(({ codigo, detalle, unidad }) => ({
						id: codigo,
						text: detalle,
						desc_prod: detalle
					})).filter(result => result.text.toLowerCase().includes(searchTerm))
					: data.map(({ codigo, detalle, unidad }) => ({
						id: codigo,
						text: detalle,
						desc_prod: detalle
					}))
				
				return { results }
			}
		}
	}

	$("#products").select2(combo_configs)
	.on('select2:open', () => $(".select2-search__field")[0].focus())
	.on("select2:close", () => {
		if ($(".select2-search__field").val() === "") {
			$("#products").select2("search", "")
		}
	})
	.on("select2-clearing", () => { $(this).val(null).trigger("change") })
}

// Ejecutar
const tkn = getParameter('tkn')
if (tkn) {
	get_customers( tkn )
	get_products( tkn )
	get_startMonth( tkn )
}