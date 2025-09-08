CREATE TABLE bookdrop_file
(
    id                BIGSERIAL PRIMARY KEY,
    file_path         TEXT         NOT NULL,
    file_name         VARCHAR(512) NOT NULL,
    file_size         BIGINT,
    status            VARCHAR(20)  NOT NULL DEFAULT 'PENDING_REVIEW',
    original_metadata JSONB,
    fetched_metadata  JSONB,
    created_at        TIMESTAMPTZ           DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMPTZ           DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookdrop_file_updated_at BEFORE UPDATE ON bookdrop_file FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE UNIQUE INDEX uq_file_path ON bookdrop_file (file_path);