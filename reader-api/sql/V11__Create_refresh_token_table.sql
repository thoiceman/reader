CREATE TABLE refresh_token
(
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT    NOT NULL,
    token           VARCHAR(512) NOT NULL,
    expiry_date     TIMESTAMPTZ NOT NULL,
    revoked         BOOLEAN   NOT NULL DEFAULT FALSE,
    revocation_date TIMESTAMPTZ NULL,

    CONSTRAINT uq_refresh_token UNIQUE (token),
    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);