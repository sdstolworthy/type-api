import { IEnv, run } from './app'
import Cron from './config/cron'

// cron
Cron.init()

// express
run(process.env as unknown as IEnv)
