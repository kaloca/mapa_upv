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

	const [array, setarray] = React.useState([])

	let dttt = []
	dttt.push(Date.now())

	const ref = useD3(() => {
		console.log('running d3')

		var width = 590,
			height = 210

		var svg = d3
			.select('body')
			.append('svg')
			.attr('width', width)
			.attr('height', height)

		var projection = d3.geoMercator().center([-36, -10]).scale(5000)

		var path = d3.geoPath(projection)

		var color = d3.scaleLinear().domain([1, 26]).range(['white', 'red'])

		var dataUrl =
			'https://raw.githubusercontent.com/embs/coronaviz/master/pe-cities-numbers.json'
		d3.json(dataUrl, function (citiesNumbers) {
			// Convert keys to match d.properties.NM_MUNICIP.
			for (let [key, value] of Object.entries(citiesNumbers)) {
				citiesNumbers[key.toUpperCase()] = value
			}

			d3.json(
				'https://raw.githubusercontent.com/embs/coronaviz/master/pe-municipalities.geojson',
				function (error, municipalities) {
					if (error) return console.log(error)

					svg.append('path')
						.datum({
							type: 'FeatureCollection',
							features: municipalities.features,
						})
						.attr('d', path)
						.attr('class', 'municipalities')

					svg.selectAll('path')
						.data(municipalities.features)
						.enter()
						.append('path')
						.attr('d', path)
						.style('fill', function (d) {
							var cityNumbers =
								citiesNumbers[d.properties.NM_MUNICIP]

							if (cityNumbers) {
								return color(cityNumbers[2])
							} else {
								return color(1)
							}
						})
				}
			)
		})
	}, dttt)

	return (
		<div className={'main-svg'} ref={ref}>
			<p>Inside D3 Component</p>
		</div>
	)
}

export default D3component
