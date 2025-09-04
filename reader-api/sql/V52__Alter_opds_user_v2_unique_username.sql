ALTER TABLE opds_user_v2
    DROP CONSTRAINT fk_opds_user;
ALTER TABLE opds_user_v2
    DROP CONSTRAINT uq_userid_username;
ALTER TABLE opds_user_v2
    ADD CONSTRAINT uq_username UNIQUE (username);
ALTER TABLE opds_user_v2
    ADD CONSTRAINT fk_opds_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;