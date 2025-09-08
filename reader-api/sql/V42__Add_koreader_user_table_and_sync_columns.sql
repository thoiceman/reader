CREATE TABLE koreader_user
(
    id               BIGSERIAL PRIMARY KEY,
    username         VARCHAR(100) NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    password_md5     VARCHAR(255) NOT NULL,
    sync_enabled     BOOLEAN,
    booklore_user_id BIGINT,
    created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booklore_user FOREIGN KEY (booklore_user_id) REFERENCES users (id)
);

-- Create trigger for updated_at
CREATE TRIGGER update_koreader_user_updated_at BEFORE UPDATE ON koreader_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE user_book_progress
    ADD COLUMN koreader_progress         VARCHAR(1000),
    ADD COLUMN koreader_progress_percent FLOAT,
    ADD COLUMN koreader_device           VARCHAR(100),
    ADD COLUMN koreader_device_id        VARCHAR(100),
    ADD COLUMN koreader_last_sync_time   TIMESTAMPTZ;

ALTER TABLE user_permissions
    ADD COLUMN permission_sync_koreader BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE user_permissions
SET permission_sync_koreader = TRUE
WHERE permission_admin = TRUE;

