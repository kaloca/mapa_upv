import * as d3 from 'd3'
import React from 'react'
import { View, Text } from 'react-native'
import { useD3 } from './useD3'

const d3component = ({ data }) => {
	let datasw = d3.csv(
		'http://localhost:8000/data.csv',
		({
			local,
			UF,
			cidade,
			num_req,
			product_code,
			description,
			grupo,
			Unidade,
			ubs_number,
			status,
		}) => [
			local,
			UF,
			cidade,
			num_req,
			product_code,
			description,
			grupo,
			Unidade,
			ubs_number,
			status,
		]
	)

	const ref = useD3()

	return (
		<View>
			<Text></Text>
		</View>
	)
}

export default d3component
