## Pruebas basadas con un Container PBX 

Antes de inicializar el script de stress tener el asterisk configurado

* pjsip_wizard.conf (troncal destino)
* extensions.conf (contexto dialplan recepcion por default: "stres-test")
* manager.conf (conexion al socket AMI)

## ENV de Asterisk:

Inicialización del docker:

```docker
version: "2"
services:

    test-pbx:
        image: pkecastillo/pbx-ast18-pjsip:latest
        container_name: "test-pbx"
        user: root
        privileged: true
        network_mode: host
        stdin_open: true
        restart: always
        volumes:
            # - ./DATA/asterisk:/etc/asterisk
            - /etc/timezone:/etc/timezone:ro
            - /etc/localtime:/etc/localtime:ro
        cpu_shares: 2
        environment:
            - ASTERISK_USER_AGENT=${ASTERISK_USER_AGENT}
            - ASTERISK_PJSIP_EXTERNAL_MEDIA_ADDRESS=${ASTERISK_PJSIP_EXTERNAL_MEDIA_ADDRESS}
            - ASTERISK_PJSIP_EXTERNAL_SIGNALING_ADDRESS=${ASTERISK_PJSIP_EXTERNAL_SIGNALING_ADDRESS}
```


Configuracion ENVS (reemplazar las XXX por el numero de IP) only that! and run with docker composer up ;)

.env

```bash
ASTERISK_USER_AGENT=PBX-TEST
ASTERISK_PJSIP_EXTERNAL_MEDIA_ADDRESS=XXX.XXX.XXX.XXX
ASTERISK_PJSIP_EXTERNAL_SIGNALING_ADDRESS=XXX.XXX.XXX.XXX
```



Edicion del Script:

```typescript
async function loop(){
  
  let ActionID = Math.floor(Math.random() * 1000) + 100;
  
  let json = {
    "ActionID": ActionID,
    "Action": "originate",
    "channel": "PJSIP/123456@TRUNK_TEST", // ---> INFORMACION DELA LLAMADA SALIENTE DE STRESS
    "context":'stres-test',  // CONTEXTO PARA LUEGO DE ABIERTO EL CANAL VIA ANSWERD
    "exten":"s", 
    "priority":"1",
    "callerid": "111222333", // ------> MODIFICAR EL CID CON EL QUE SE ENVIARAN LAS LLAMADAS
    "Variable" : "VAR1=1,VAR2=2"
  }; 

  try {
      //let res_cmd = await Command(json.ActionID,json); //1
      // json originate formado
      console.log(json);

  }catch(err){
    console.log(err)
  }
  //cada 500 ms   ----> MODIFICAR ESTE VALOR PARA EL TIEMPO EN ms
  setTimeout(loop, 500);

}
```