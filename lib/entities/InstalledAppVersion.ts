import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export default class InstalledAppVersion extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn()
	timestamp: Date

	@Column('varchar')
	version: string
}
