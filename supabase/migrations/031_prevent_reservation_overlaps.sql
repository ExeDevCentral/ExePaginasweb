-- Prevent concurrent reservations for the same employee from overlapping.
-- GiST exclusion constraints serialize conflicting inserts at the database layer.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_employee_time_no_overlap
  EXCLUDE USING gist (
    employee_id WITH =,
    tstzrange(inicio_at, fin_at, '[)') WITH &&
  )
  WHERE (status NOT IN ('cancelled', 'no_show'));
