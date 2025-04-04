// Configuration file for shared constants
export const CHARACTER_SET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"; // Default character set for password generation
export const PASSWORD_LENGTH = 5; // Default password length
export const PROGRESS_UPDATE_INTERVAL = 10000; // Number of guesses between progress updates
export const NUM_WORKERS = Math.min(4, navigator.hardwareConcurrency || 4); // Default to 4 if hardwareConcurrency is unavailable
// export const NUM_WORKERS = 4; // Number of workers to use for parallel processing
export const BATCH_SIZE = 1000; // Number of guesses per batch dependant on memory