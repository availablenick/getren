FROM postgres:12
RUN echo "#!/bin/bash \n psql -U user postgres -c 'CREATE DATABASE test_api'" | \
  cat > /docker-entrypoint-initdb.d/create_test_api.sh
