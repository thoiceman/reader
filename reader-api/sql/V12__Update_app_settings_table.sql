ALTER TABLE app_settings
    ALTER COLUMN name SET NOT NULL;

CREATE UNIQUE INDEX uq_app_settings_name ON app_settings (name);

ALTER TABLE app_settings
    ALTER COLUMN val DROP NOT NULL;