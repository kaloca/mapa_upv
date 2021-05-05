import * as d3 from 'd3'
import React from 'react'
import { feature } from 'topojson'
import { mercator } from 'd3-geo'
import { queue } from 'd3-queue'
import { useD3 } from './useD3'

const D3component = ({ data }) => {
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

	const ref = useD3(() => {
		console.log('running d3')

		const width = 900,
			height = 650

		const svg = d3
			.select('.main-svg')
			.append('svg')
			.attr('width', width)
			.attr('height', height)

		const projection = d3.geoMercator().center([-55, -10]).scale(750)

		let path = d3.geoPath().projection(projection)

		const execute = (error, br_cities) => {
			if (error) return console.error(error)

			let cities = feature(br_cities, br_cities.objects.states)

			svg.append('path')
				.datum({
					type: 'FeatureCollection,',
					features: br_cities.features,
				})
				.attr('d', path)
				.attr('class', 'cities')
		}

		queue()
			.defer(d3.json, 'http://localhost:8000/br-states.json')
			.await(execute)
	}, [datasw])

	return (
		<div className={'main-svg'} ref={ref}>
			<p>Inside D3 Component</p>
		</div>
	)
}

export default D3component

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