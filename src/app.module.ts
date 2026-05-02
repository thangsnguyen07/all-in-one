import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from './configs/database.config'
import jwtConfig from './configs/jwt.config'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: async (dbConfig: any) => ({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        autoLoadEntities: true,
        synchronize: true, // Only for development
      }),
    }),
    AuthModule,
    // UserModule is imported by AuthModule, but we can also import it here to be explicit
    // UserModule is registered
  ],
})
export class AppModule {}
