#!/bin/bash

# dropdb northwind
# dropuser northwind_user
# createdb northwind

psql postgres < /data/base/distributedDatabaseTest/citusDistribution.sql

psql template1 -c "create user postgres;"
psql template1 -c "alter user postgres password 'thewindisblowing';"
psql template1 -c "grant all on DATABASE postgres to postgres;"
psql postgres -c "GRANT ALL on ALL tables IN SCHEMA public to postgres"
psql postgres -c "GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;"
