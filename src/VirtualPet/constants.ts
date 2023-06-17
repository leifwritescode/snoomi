export const SCHEDULER_JOB_WELFARE_TICK = "deplete_meters";
export const SCHEDULER_JOB_AGE_TICK = "increase_age";
export const REDIS_KEY_DEPLETE_METERS_JOB_ID = `scheduler:job:${SCHEDULER_JOB_WELFARE_TICK}`
export const REDIS_KEY_INCREASE_AGE_JOB_ID = `scheduler:job:${SCHEDULER_JOB_AGE_TICK}`;
export const REDIS_KEY_DEFAULT_SNOOMAGOTCHI_STATE = "default_snoomagotchi_state";
