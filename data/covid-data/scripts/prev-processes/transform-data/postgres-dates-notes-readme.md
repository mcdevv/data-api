
https://node-postgres.com/features/types
* converts js Date obj to date, timestamp, timestampz and back
* node-postgres converts DATE and TIMESTAMP columns into the local time of the node process set at process.env.TZ
* use TIMESTAMPTZ when storing dates; otherwise, inserting a time from a process in one timezone and reading it out in a process in another timezone can cause unexpected differences in the time.
* 