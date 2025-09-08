CREATE TABLE magic_shelf
(
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    name        VARCHAR(255) NOT NULL,
    icon        VARCHAR(64)  NOT NULL,
    filter_json JSONB        NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for updated_at
CREATE TRIGGER update_magic_shelf_updated_at BEFORE UPDATE ON magic_shelf FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE UNIQUE INDEX uq_user_name ON magic_shelf (user_id, name);