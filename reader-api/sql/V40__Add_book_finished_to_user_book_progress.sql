ALTER TABLE user_book_progress 
ADD COLUMN date_finished TIMESTAMPTZ NULL DEFAULT NULL;

CREATE INDEX idx_user_book_progress_date_finished ON user_book_progress (date_finished);