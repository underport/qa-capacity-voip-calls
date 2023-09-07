## Pruebas basadas con un Container existente PBX

Antes de inicializar el script de qa tener el asterisk configurado


## ENV de Asterisk:

#### DATOS PARA IP ASTERISK CORE y LocalNet

HOST_IP=X.X.X.X
LOCAL_NET=172.0.0.0/8

#### CARGAR DATOS CONEXION DB
MYSQL_HOST_DB=127.0.0.1
MYSQL_DATABASE_DB=asteriskconfig
MYSQL_USER_DB=root
MYSQL_PASS_DB=123456
MYSQL_PORT_DB=3306

### CARGAR DATOS CONEXION DB CDR
MYSQL_HOST_DB_CDR=127.0.0.1
MYSQL_DATABASE_DB_CDR=asteriskconfigcdr
MYSQL_USER_DB_CDR=root
MYSQL_PASS_DB_CDR=123456
MYSQL_PORT_DB_CDR=3306


Docker Compose

```
version: '2'

services:

  pbx:
    container_name: pbxv3
    image: pkecastillo/centralitapbx:v1.3
    network_mode: host
    privileged: true
    restart: always
    # ports:
    #   - "5060:5060/udp"
    #   - "10000-10010:10000-10010/udp"
    #   - "5038:5038"
    #   - "8088:8088"
    #volumes:
    #  - /home/DESTINO/pbxv3:/etc/asterisk:rw
    # environment:
    env_file:
      - .env
    cpu_shares: 2
    ```