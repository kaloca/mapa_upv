// https://observablehq.com/@inacioluiz/municipios-com-obras-na-area-da-saude@768
export default function define(runtime, observer) {
	const main = runtime.module()
	main.variable(observer()).define(['md'], function (md) {
		return md`
# Municípios com obras na área da Saúde

dados: http://i3geo.saude.gov.br/i3geo/ogc.php?`
	})
	main.variable(observer('chart')).define(
		'chart',
		['d3', 'topojson', 'br', 'us_vitimas'],
		function (d3, topojson, br, us_vitimas) {
			const projection = d3.geoMercator().scale(750)

			const path = d3.geoPath().projection(projection)

			const svg = d3
				.create('svg')
				.attr('viewBox', '-700 150 1000 600')
				.style('width', '100%')
				.style('height', 'auto')

			const gstates = svg.append('g').attr('id', 'gstates')

			gstates
				.selectAll('path')
				.data(topojson.feature(br, br.objects.states).features)
				.join('path')
				.attr('fill', 'none')
				.attr('stroke', 'black')
				.attr('id', (d) => `estado_${d.id}`)
				.attr('stroke-width', 0.3)
				.attr('stroke-linejoin', 'round')
				.attr('fill-opacity', 0)
				.attr('d', path)
				.append('title')
				.text((d) => d.properties.name)

			const vitimas = svg.append('g').attr('id', 'vitimas')

			vitimas
				.selectAll('path')
				.data(
					topojson.feature(
						us_vitimas,
						us_vitimas.objects.balanço_saude
					).features
				)
				.join('path')
				.attr('fill', 'purple')
				.attr('stroke', 'none')
				.attr('id', (d) => `municipio_${d.id}`)
				.attr('class', 'feature')
				.attr('d', path)
				.append('title')
				.text((d) => `${d.properties[0].no_cidade}`)

			//  const gcities = svg.append("g")
			//         .attr("id", "gcities");

			//   gcities.selectAll("path")
			//         .data(topojson.feature(br, br.objects.cities).features)
			//         .join("path")
			//             .attr("fill-opacity", 0)
			//             .attr("stroke", "none")
			//             .attr("id", d => `municipio_${d.id}`)
			//             .attr("class", "feature")
			//             .attr("d", path)
			//                 .append("title")
			//                 .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}`);

			var zoom = d3.zoom().on('zoom', () => {
				gstates.attr('transform', d3.event.transform)
				// gcities.attr("transform", d3.event.transform);
				vitimas.attr('transform', d3.event.transform)
			})

			// svg.append("g")
			//       .attr("transform", "translate(-100, 200) scale(1.3)")
			//       .call(legend);

			svg.call(zoom)

			return svg.node()
		}
	)
	main.variable(observer('data')).define('data', ['d3'], async function (d3) {
		return Object.assign(
			new Map(
				await d3.csv(
					'https://gist.githubusercontent.com/Dienert/6c29ca5ce18ee07ef6853643d269eb25/raw/66662b17ab6fb3e2a0ccf3fc36510ed4e443159e/analfabetismo_municipios_brasil_2010.csv',
					({ Município, rate, codigo_uf }) => [
						codigo_uf + '-' + Município,
						+rate,
					]
				)
			),
			{ title: 'Taxa de Analfabetismo (%)' }
		)
	})
	main.variable(observer('color')).define('color', ['d3'], function (d3) {
		return d3.scaleQuantize([0, 40], d3.schemeReds[9])
	})
	main.variable(observer('locale')).define('locale', ['d3'], function (d3) {
		return d3.json(
			'https://unpkg.com/d3-format@1/locale/pt-BR.json',
			function (error, locale) {
				if (error) throw error
			}
		)
	})
	main.variable(observer('format')).define(
		'format',
		['d3', 'locale'],
		function (d3, locale) {
			return d3.formatDefaultLocale(locale).format('.1f')
		}
	)
	main.variable(observer('states')).define('states', ['br'], function (br) {
		return new Map(
			br.objects.states.geometries.map((d) => [d.id, d.properties])
		)
	})
	main.variable(observer('cities')).define('cities', ['br'], function (br) {
		return new Map(
			br.objects.cities.geometries.map((d) => [d.id, d.properties])
		)
	})
	main.variable(observer('br')).define('br', ['d3'], function (d3) {
		return d3.json(
			'https://gist.githubusercontent.com/Dienert/290f1428cca865cdfb5bc7d0dfcec473/raw/3d45041b0d31c5622ad8764460accdd8634caa10/brasil_estados_cidades_topo.json'
		)
	})
	main.variable(observer('us_vitimas')).define(
		'us_vitimas',
		['d3'],
		function (d3) {
			return d3.json(
				'https://gist.githubusercontent.com/Inacioluiz/47e205c9a9d6dd370111c1bc87af12d6/raw/2366ee2a41fce9d8d8429e9c91e9d2377d8095a7/balan%25C3%25A7o_saude2.json'
			)
		}
	)
	main.variable(observer('topojson')).define(
		'topojson',
		['require'],
		function (require) {
			return require('topojson-client@3')
		}
	)
	main.variable(observer('d3')).define('d3', ['require'], function (require) {
		return require('d3@5')
	})
	return main
}
