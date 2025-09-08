CREATE TABLE opds_user_v2
(
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT       NOT NULL,
    username      VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_opds_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_userid_username UNIQUE (user_id, username)
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_opds_user_v2_updated_at BEFORE UPDATE ON opds_user_v2
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE user_permissions
    ADD COLUMN permission_access_opds BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE user_permissions
SET permission_access_opds = TRUE
WHERE permission_admin = TRUE;