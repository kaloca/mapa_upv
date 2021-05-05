import * as d3 from 'd3'
import React from 'react'
import { useD3 } from './useD3'

const D3component = ({ data }) => {
	const ref = useD3(() => {
		var width = 1000,
			height = 700

		var svg = d3
			.select('.react-svg')
			.append('svg')
			.attr('width', width)
			.attr('height', height)

		var projection = d3.geoMercator().center([-36, -10]).scale(750)

		var path = d3.geoPath(projection)

		let cities, painted

		d3.json(
			'http://localhost:8000/geojs-100-mun.json',
			function (error, municipalities) {
				if (error) return console.log('fff', error)

				cities = svg
					.append('path')
					.datum({
						type: 'Topology',
						features: municipalities.features,
					})
					.attr('d', path)
					.attr('class', 'municipalities')

				painted = svg
					.selectAll('path')
					.data(municipalities.features)
					.enter()
					.append('path')
					.attr('d', path)
					.style('fill', 'red')
			}
		)

		var zoom = d3.zoom().on('zoom', () => {
			//cities.attr('transform', d3.event.transform)
			painted.attr('transform', d3.event.transform)
		})
		svg.call(zoom)
	}, [])

	return (
		<div className={'react-svg'} ref={ref}>
			<p>Inside D3 Component</p>
		</div>
	)
}

export default D3component
