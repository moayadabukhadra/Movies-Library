DROP TABLE IF EXISTS newMovie;

CREATE TABLE IF NOT EXISTS newMovie (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    poster_path VARCHAR(1000),
    overview VARCHAR(10000),
    comment VARCHAR(255)
);