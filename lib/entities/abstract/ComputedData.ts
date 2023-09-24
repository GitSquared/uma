import {
	BaseEntity,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import LocationPoint from '../LocationPoint'

@Entity()
export abstract class ComputedData extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@UpdateDateColumn()
	lastUpdatedAt: Date

	@ManyToOne(() => LocationPoint)
	latestPoint: LocationPoint

	@ManyToOne(() => LocationPoint)
	earliestPoint: LocationPoint
}
