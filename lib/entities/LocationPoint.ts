import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export default class LocationPoint extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@CreateDateColumn()
	timestamp: Date

	@Column('float')
	latitude: number

	@Column('float')
	longitude: number

	@Column({
		type: 'float',
		nullable: true,
	})
	altitude?: number

	@Column({
		type: 'float',
		nullable: true,
	})
	accuracy?: number

	@Column({
		type: 'float',
		nullable: true,
	})
	speed?: number

	@Column({
		type: 'float',
		nullable: true,
	})
	heading?: number
}
