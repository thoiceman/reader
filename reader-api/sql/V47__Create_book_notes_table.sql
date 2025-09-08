CREATE TABLE book_notes
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT    NOT NULL,
    book_id    BIGINT    NOT NULL,
    title      VARCHAR(255),
    content    TEXT      NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_book_notes_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_book_notes_book_id FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE
);

-- Create trigger for updated_at
CREATE TRIGGER update_book_notes_updated_at BEFORE UPDATE ON book_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_book_notes_user_id ON book_notes (user_id);
CREATE INDEX idx_book_notes_book_id ON book_notes (book_id);
