import { getParameter } from "../../jsgen/Helper"
import { get_businessUnits, get_coins, get_startMonth, get_costCenter } from "../../jsgen/Apis-Helper"

// Listado de cuentas
const get_accountsPlan = async(tkn) => {
	const url_getAccountPlan = process.env.Solu_externo + '/listados/get_plan_cuenta'
	try {
		const response = await fetch(url_getAccountPlan, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${tkn}`
			},
			body: JSON.stringify({
				"tipo": 1,
				"alfa": 1,
				"todos": 1
			})
		})
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`)
		}
		return await response.json()
	} catch (error) {
		console.error(`Could not get accounts: ${error}`)
	}
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
	get_startMonth( tkn )
	get_businessUnits( tkn )
	get_coins( tkn )
	get_costCenter( tkn )
	get_accountsPlan(tkn).then(accounts => {
		accounts[0].codigo = 'TODAS_ID'
		const data = accounts.map(({ codigo, nombre }) => ({
			id: codigo,
			text: nombre
		}))

		const combo_configs = {
			allowClear: true,
			language: {
				noResults: () => "No se encontraron resultados",
			},
			placeholder: 'Buscar cuenta',
			data: data,
		}

		// Agregamos la opción vacía y inicializamos el select2
		data.unshift({
			id: '',
			text: ''
		})
		$("#account").select2(combo_configs)
			.on('select2:open', () => $(".select2-search__field")[0].focus())
			.on("select2-clearing", () => { $(this).val(null).trigger("change") })
		
		const account = getParameter('cuenta')
		$("#account").val(Number(account)).trigger('change')
	})
	.catch(error => {
		console.error(`Could not update account select: ${error}`)
	})
}