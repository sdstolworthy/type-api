/**
 * settings.ts
 * This should be the ONLY file that accesses process.env.
 */
export default {
  port: parseInt(process.env.PORT, 10) || 3100,
}
