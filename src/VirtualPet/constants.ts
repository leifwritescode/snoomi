export const SCHEDULER_JOB_WELFARE_TICK = "deplete_meters";
export const SCHEDULER_JOB_AGE_TICK = "increase_age";
export const REDIS_KEY_WELFARE_TICK_JOB_ID = `scheduler:job:${SCHEDULER_JOB_WELFARE_TICK}`
export const REDIS_KEY_AGE_TICK_JOB_ID = `scheduler:job:${SCHEDULER_JOB_AGE_TICK}`;
export const REDIS_KEY_KEITH = "virtualpet:thecomputer:keith";
export const REDIS_KEY_WELFARE_TICK_BATCHES = "batches:welfare";
export const REDIS_KEY_AGE_TICK_BATCHES = "batches:age";
export const NUMERICS_MAX_DATE_MS = 8640000000000000; // Saturday, 13th September 2755760 00:00:00 UTC
