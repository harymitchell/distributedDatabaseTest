#!/bin/bash

# dropdb northwind
# dropuser northwind_user
# createdb northwind

psql northwind < /data/base/distributedDatabaseTest/northwind_psql-master/northwind.sql

psql template1 -c "create user northwind_user;"
psql template1 -c "alter user northwind_user password 'thewindisblowing';"
psql template1 -c "grant all on DATABASE northwind to northwind_user;"
psql northwind -c "GRANT ALL on ALL tables IN SCHEMA public to northwind_user"
psql northwind -c "GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO northwind_user;"

psql northwind < /data/base/distributedDatabaseTest/citusDistribution.sql
