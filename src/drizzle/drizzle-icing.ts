import {
    boolean,
    mysqlEnum,
    mysqlTable,
    timestamp,
    varchar,
    uniqueIndex
} from 'drizzle-orm/mysql-core'
import type { MySqlColumnBuilder } from 'drizzle-orm/mysql-core'

// Specifikus típusok az egyes oszlopokhoz
type VarcharProp = {
    name: string
    length: number
    db: (prop: VarcharProp) => MySqlColumnBuilder
}

type TimestampProp = {
    name: string
    db: (prop: TimestampProp) => MySqlColumnBuilder
}

type EnumProp = {
    name: string
    enums: readonly [string, ...string[]]
    db: (prop: EnumProp) => MySqlColumnBuilder
}

type BooleanProp = {
    name: string
    db: (prop: BooleanProp) => MySqlColumnBuilder
}

// Az összes lehetséges oszloptípus egyesítése
type IcingProp = VarcharProp | TimestampProp | EnumProp | BooleanProp

type IcingSchema = {
    tableName: string
    props: IcingProp[]
    db: (prop: IcingProp) => MySqlColumnBuilder
}

const userSchema: IcingSchema = {
    tableName: 'users',
    props: [
        {
            name: 'id',
            length: 36,
            db: (prop) => varchar(prop.name, { length: prop.length }).primaryKey()
        },
        {
            name: 'createdAt',
            db: (prop) => timestamp(prop.name).defaultNow().notNull()
        },
        {
            name: 'username',
            length: 60,
            db: (prop) => varchar(prop.name, { length: prop.length }).notNull().default('')
        },
        {
            name: 'password',
            length: 256,
            db: (prop) =>
                varchar(prop.name, { length: prop.length })
                    .notNull()
                    .default('no-password-specified')
        },
        {
            name: 'useAsDisplayName',
            enums: ['username', 'email', 'realName'] as const,
            db: (prop) => mysqlEnum(prop.name, prop.enums).notNull().default('username')
        },
        {
            name: 'admin',
            db: (prop) => boolean(prop.name).notNull().default(false)
        }
    ]
}

const makeTable = (schema: IcingSchema) => {
    const columns: Record<string, MySqlColumnBuilder> = {}
    for (const prop of schema.props) {
        columns[prop.name] = prop.db(prop)
    }
    return mysqlTable(schema.tableName, columns)
}

export const users = makeTable(userSchema)

export default {
    users
}

// Típus, amely automatikusan kikövetkezteti a visszatérési típust lekérdezés esetén.
export type User = typeof users.$inferSelect
