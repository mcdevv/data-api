// eslint-disable-next-line no-unused-expressions
`
DROP TABLE IF EXISTS messages;
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR DEFAULT '',
  message VARCHAR NOT NULL
)


INSERT INTO messages
(name, message)
VALUES 
('chidimo', 'first message'),('orji', 'second message')


-- get schemas
SELECT datname FROM pg_database WHERE datistemplate = false;
-- tables in my schema
select * 
from information_schema.tables
where table_schema = 'information_schema



`;
