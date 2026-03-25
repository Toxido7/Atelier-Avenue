import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { defineConfig } from 'prisma/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

export default defineConfig({
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  migrations: {
    path: path.join(__dirname, 'prisma/migrations'),
    seed: 'node prisma/seed.js',
  },
})