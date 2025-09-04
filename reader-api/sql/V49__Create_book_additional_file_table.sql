CREATE TABLE book_additional_file
(
    id                   BIGSERIAL PRIMARY KEY,
    book_id              BIGINT       NOT NULL,
    file_name            VARCHAR(1000) NOT NULL,
    file_sub_path        VARCHAR(512) NOT NULL,
    additional_file_type VARCHAR(20) NOT NULL CHECK (additional_file_type IN ('ALTERNATIVE_FORMAT', 'SUPPLEMENTARY')),
    file_size_kb         BIGINT,
    initial_hash         VARCHAR(128),
    current_hash         VARCHAR(128),
    description          TEXT,
    added_on             TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_book_additional_file_book FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE
);

CREATE INDEX idx_book_additional_file_book_id ON book_additional_file(book_id);

-- Create partial unique index for alternative format files
CREATE UNIQUE INDEX idx_book_additional_file_current_hash_alt_format 
ON book_additional_file (current_hash) 
WHERE additional_file_type = 'ALTERNATIVE_FORMAT';
