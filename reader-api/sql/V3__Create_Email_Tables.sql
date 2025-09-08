CREATE TABLE email_provider
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    host       VARCHAR(255) NOT NULL,
    port       INT          NOT NULL,
    username   VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    auth       BOOLEAN      NOT NULL,
    start_tls  BOOLEAN      NOT NULL,
    is_default BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name, host, username)
);

CREATE TABLE email_recipient
(
    id         BIGSERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    name       VARCHAR(255) NOT NULL,
    is_default BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE user_permissions
    ADD COLUMN permission_email_book BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE user_permissions
SET permission_email_book = TRUE
FROM users
WHERE user_permissions.user_id = users.id
  AND users.name = 'admin';
