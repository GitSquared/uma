import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity()
export default class UserSetting extends BaseEntity {
	@PrimaryColumn('varchar')
	@Index({ unique: true })
	key: string

	@Column('int')
	value: number
}
