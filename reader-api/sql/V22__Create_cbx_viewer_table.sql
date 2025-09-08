CREATE TABLE cbx_viewer_preference
(
    id        BIGSERIAL PRIMARY KEY,
    user_id   BIGINT      NOT NULL,
    book_id   BIGINT      NOT NULL,
    spread    VARCHAR(16) NULL,
    view_mode VARCHAR(16) NULL,
    UNIQUE (user_id, book_id)
);