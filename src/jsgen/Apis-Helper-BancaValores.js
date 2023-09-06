// Funcion generica para manejar los fetch requests.
async function fetchData(url, token) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Fetch error: ${error}`)
  }
}

// Listado de cuentas estado (Formulario Valores)
export const get_statusAccount = async tkn => {
  const url_getStatusAccount = process.env.Solu_externo + '/bancosyvalores/reportes/get_cuentas_estado'
  const statusAccounts = await fetchData(url_getStatusAccount, tkn)

  for (const { codigo, nombre } of statusAccounts) {
    const select = document.querySelector('#status')
    let option = document.createElement("option")
    option.setAttribute("data-tokens", nombre)
    option.value = codigo
    option.textContent = nombre
    select.appendChild(option)
  }
}

// conseguir tipo de periodo (Formulario Valores)
export const get_periodType = async tkn => {
  const url_getPeriodType = process.env.Solu_externo + '/bancosyvalores/reportes/get_tipos_periodo'
  const periodTypes = await fetchData(url_getPeriodType, tkn)

	for (const { codigo, nombre } of periodTypes) {
		const select = document.querySelector('#period-type')
		let option = document.createElement("option")
		option.setAttribute("data-tokens", nombre)
		option.value = codigo
		option.textContent = nombre
		select.appendChild( option )
	}
}

// Conseguir select order (Formulario Valores)
export const get_order = async tkn => {
  const url_getOrder = process.env.Solu_externo + '/bancosyvalores/reportes/get_tipos_orden'
  const orders = await fetchData(url_getOrder, tkn)

	for (const { codigo, nombre } of orders) {
		const select = document.querySelector('#order')
		let option = document.createElement("option")
		option.setAttribute("data-tokens", nombre)
		option.value = codigo
		option.textContent = nombre
		select.appendChild( option )
	}
}

// Conseguir input select valor (Formulario Valores)
export const get_value = async tkn => {
  const url_getValue = process.env.Solu_externo + '/bancosyvalores/reportes/get_tipos_valores'
  const values = await fetchData(url_getValue, tkn)

	for (const { id, nombre } of values) {
		// console.log(id, nombre)
		const select = document.querySelector('#value')
		let option = document.createElement("option")
		option.setAttribute("data-tokens", nombre)
		option.value = id
		option.textContent = nombre
		select.appendChild( option )
	}
}

// Conseguir input select valor (Formulario Valores)
export const get_cardGroups = async tkn => {
	const url_getCardGroups = process.env.Solu_externo + '/bancosyvalores/conciliar_tarjetas/get_grupos_tarjetas'
  const cardGroups = await fetchData(url_getCardGroups, tkn)

	for (const { id, nombre } of cardGroups) {
		// console.log(id, nombre)
		const select = document.querySelector('#group')
		let option = document.createElement("option")
		option.setAttribute("data-tokens", nombre)
		option.value = id
		option.textContent = nombre
		select.appendChild( option )
	}
}

// Conseguir input select cuentas (Formulario Libro Banco)
export const get_accountsLibroBanco = async tkn => {
	const url_getAccountsLibroBanco = process.env.Solu_externo + '/bancosyvalores/librobanco/get_cuentas'
  const {cuentas} = await fetchData(url_getAccountsLibroBanco, tkn)

	for (const { codigo, banco } of cuentas) {
		// console.log(codigo, banco)
		const select = document.querySelector('#account')
		let option = document.createElement("option")
		option.setAttribute("data-tokens", banco)
		option.value = codigo
		option.textContent = banco
		select.appendChild( option )
	}
}

// Conseguir input select operaciones (Formulario Libro Banco)
export const get_operationsLibroBanco = async tkn => {
	const url_getOperationsLibroBanco = process.env.Solu_externo + '/bancosyvalores/librobanco/get_operaciones'
  const {operaciones} = await fetchData(url_getOperationsLibroBanco, tkn)

	for (const { id, operacion } of operaciones) {
		// console.log(id, operacion)
		const select = document.querySelector('#operation')
		let option = document.createElement("option")
		option.setAttribute("data-tokens", operacion)
		option.value = id
		option.textContent = operacion
		select.appendChild( option )
	}
}