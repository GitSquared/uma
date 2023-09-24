import { Column, Entity } from 'typeorm'

import { ComputedData } from './abstract/ComputedData'

@Entity()
export default class ComputedWalkTrace extends ComputedData {
	@Column('simple-json')
	geojson: GeoJSON.FeatureCollection<GeoJSON.LineString>
}
