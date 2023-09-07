import AmiClient from "asterisk-ami-client"
import * as dotenv from "dotenv";
import * as http from "http";

dotenv.config();

if (process.env.DEBUG == "true") {console.log('Inicia')}

async function loop(){
  
  let ActionID = Math.floor(Math.random() * 1000) + 100;
  
  let json = {
    "ActionID": ActionID,
    "Action": "originate",
    "channel": "PJSIP/123456@TRONCALTEST",
    "context":'qa-test',
    "exten":"s", 
    "priority":"1",
    "callerid": "111222333",
    "Variable" : "VAR1=1,VAR2=2"
  }; 

  try {
      //descomentar para sacar originates
      //let res_cmd = await Command(json.ActionID,json); //1
      //let res_cmd_1 = await Command(json.ActionID,json); //1
      //let res_cmd_2 = await Command(json.ActionID,json); //2
      //let res_cmd_3 = await Command(json.ActionID,json); //3
      //let res_cmd_4 = await Command(json.ActionID,json); //4
      //let res_cmd_5 = await Command(json.ActionID,json); //5
      
      // json originate formado
      console.log(json);
      //console.log(res_cmd_1);
      //console.log(res_cmd_2);
      //console.log(res_cmd_3);
      //console.log(res_cmd_4);
      //console.log(res_cmd_5);
  }catch(err){
    console.log(err)
  }
  //cada 1000 ms
  setTimeout(loop, 500);

}

loop()
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

//Promise Command
async function Command(ActionID, json)  {
  // console.log(ActionID);
  // console.log(json);

  //Configuro Cliente AMI
  const client = new AmiClient({
      reconnect: false,
      keepAlive: true,
      keepAliveDelay: 60000,
      maxAttemptsCount: 2,
      attemptsDelay: 1000,
      //dontDeleteSpecActionId : true,
      emitEventsByTypes: true,
      emitResponsesById: true,
      eventFilter:  [
        "AgentLogin","Agents","AlarmClear","AsyncAGIEnd","AttendedTransfer","AuthMethodNotAllowed","BridgeDestroy","BridgeVideoSourceUpdate","ChallengeResponseFailed","ChanSpyStop","ConfbridgeEnd","ConfbridgeList","ConfbridgeStart",
        "ConfbridgeUnmute","ContactStatusDetail","DAHDIChannel","DialBegin","EndpointDetail","FullyBooted","HangupHandlerPush","Hold","InvalidPassword","LoadAverageLimit","LocalOptimizationEnd","MWIGetComplete",
        "MeetmeLeave","MeetmeTalking","MonitorStart","MusicOnHoldStop","NewConnectedLine","Newstate","ParkedCallGiveUp","PresenceStatus","QueueCallerLeave","QueueMemberPenalty","RequestBadFormat",
        "SIPQualifyPeerDone","SessionTimeout","SpanAlarm","UnParkedCall","Unload","AgentLogoff","AgentsComplete","AorDetail","AsyncAGIExec","AuthDetail","BlindTransfer","BridgeEnter","CEL","ChallengeSent","ChannelTalkingStart",
        "ConfbridgeJoin","ConfbridgeMute","ConfbridgeStopRecord","ContactList","DNDState","DialEnd","Hangup","HangupHandlerRun","IdentifyDetail","InvalidTransport","LocalBridge","MCID",
        "MeetmeEnd","MeetmeMute","MemoryLimit","MonitorStop","NewAccountCode","NewExten","OriginateResponse","ParkedCallSwap","Pickup","QueueCallerAbandon","RTCPReceived","Registry","RequestNotAllowed","Shutdown",
        "SpanAlarmClear","SuccessfulAuth","UnexpectedAddress","UserEvent","AgentRingNoAnswer","Alarm","AorList","AsyncAGIStart","AuthList","BridgeCreate","BridgeLeave","Cdr","ChanSpyStart","ChannelTalkingStop","ConfbridgeLeave",
        "ConfbridgeRecord","ConfbridgeTalking","ContactStatus","DialState","ExtensionStatus","FailedACL","HangupHandlerPop","HangupRequest","InvalidAccountID","Load","LocalOptimizationBegin","MWIGet",
        "MusicOnHoldStart","NewCallerid","Newchannel","ParkedCall","ParkedCallTimeOut","PresenceStateChange","QueueCallerJoin","QueueMemberRinginuse","RTCPSent","Reload",
        "RequestNotSupported","SessionLimit","SoftHangupRequest","TransportDetail","Unhold","VarSet"
        ],
  });

  const actID = ActionID; //using the npmjs cuid module
  const eventResponse:any = [];
  await client.connect(process.env.AMI_USER, process.env.AMI_SECRET, {host: process.env.AMI_HOST, port: process.env.AMI_PORT})
  const results = new Promise((resolve, reject) => {
      client
          .on('event', (data) => {
              if (data.ActionID == actID) {
                  eventResponse.push(data);
              }              
          })
          
          .on('response', (data) => {
              
              if (data.ActionID == actID) {
                  eventResponse.push(data);
              }

              //console.log(data)
              if (data.Response == 'Error' && data.ActionID == actID) {
                  client.disconnect();
                  reject(data)
              }
              else if(data.Response == 'Success' && data.ActionID == actID) {
                  client.disconnect();
                  resolve(eventResponse)
              }
              
          })
          
          .on('internalError', error => {
              client.disconnect();
              reject(error);
          });
  })
 

  await client.action(json, true)

await results    
return results
}





