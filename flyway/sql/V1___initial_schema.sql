CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  userid TEXT NOT NULL,
  exerciseid TEXT NOT NULL,
  code TEXT,
  result TEXT NOT NULL
);