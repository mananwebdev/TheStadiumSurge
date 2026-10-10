(() => {
  const $ = id => document.getElementById(id);
  const KEY = "surgeshield-event-v2";
  const defaults = {eventName:"Narendra Modi Stadium · Match Day",venue:"stadium",station:"Motera Stadium",attendance:28000,endTime:"22:00",share:50,weather:"normal",capacity:1200,interval:6};
  function read() { try { return {...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}; } catch { return {...defaults}; } }
  function save(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} }
  function calc(d) {
    const demand = Math.round(Number(d.attendance)*Number(d.share)/100);
    const venueFactor = ({stadium:1,festival:1.15,concert:.95,exhibition:.65})[d.venue] || 1;
    const weatherFactor = d.weather==="rain" ? 1.12 : d.weather==="heat" ? 1.06 : 1;
    const adjusted = Math.round(demand*venueFactor*weatherFactor);
    const score = adjusted/9000 + (Number(d.interval)>=8?.6:0) + (d.weather==="rain"?.5:0);
    const risk = score>=1.8 ? "HIGH" : score>=1.05 ? "MEDIUM" : "LOW";
    const suggested = risk==="HIGH" ? Math.max(3,Math.min(Number(d.interval),4)) : risk==="MEDIUM" ? Math.max(4,Math.min(Number(d.interval),6)) : Number(d.interval);
    return {...d,demand,adjusted,risk,suggested,trains:Math.ceil(adjusted/Number(d.capacity))};
  }
  function fmt(n) { return Math.round(n).toLocaleString("en-IN"); }
  function actions(p) {
    const weather = p.weather==="rain" ? "Check drainage, mark wet-floor areas and review safe access routes with station staff." : p.weather==="heat" ? "Share drinking-water information, monitor heat-stressed passengers and check ventilation." : "Check lighting, PA system, signage, ticketing equipment and emergency exits.";
    const a=[
      {time:"T−60",tag:"PREPARE",tone:"blue",title:"Activate station readiness",body:`Brief the station controller, security and customer-support teams at ${p.station}. ${weather}`},
      {time:"T−30",tag:"STAFFING",tone:"orange",title:"Stage crowd-control teams",body:"Position staff near entry gates, ticketing areas, stairs and platform access points. Keep accessible routes and emergency exits clear."},
      {time:"T−15",tag:"COMMUNICATION",tone:"blue",title:"Start passenger announcements",body:"Issue the approved event-crowd announcement in Gujarati, Hindi and English. Direct passengers to available ticketing and queue areas."},
      {time:"T+00",tag:"HIGH FLOW",tone:"red",title:"Manage the first passenger wave",body:`Monitor platform density and queue length. Planning estimate: ${fmt(p.adjusted)} metro passengers; validate against live counts before operational decisions.`},
      {time:"T+15",tag:"SERVICE",tone:"orange",title:"Review train and platform demand",body:`Suggested planning headway: ${p.suggested} minutes, subject to authorised control-room approval. The estimate is about ${p.trains} full trainloads over the surge window.`},
      {time:"T+30",tag:"REASSESS",tone:"green",title:"Reassess and safely release queues",body:"Compare observed queues with the plan, record incidents and redeploy staff only when the station controller confirms the area is safe."}
    ];
    if(p.risk==="HIGH") a.splice(1,0,{time:"T−20",tag:"PRIORITY",tone:"red",title:"Escalate high-demand readiness",body:"Request a control-room review of service capacity and crowd-control staffing. Do not change train operations without formal authorisation."});
    return a;
  }
  function escape(s) { return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function toast(msg) { const el=$("toast"); if(!el)return; el.textContent=msg;el.classList.add("show");clearTimeout(window.__ssToast);window.__ssToast=setTimeout(()=>el.classList.remove("show"),2500); }
  function getForm() {
    const val=id=>$(id)?.value;
    return {eventName:val("eventName")||defaults.eventName,venue:val("venue")||defaults.venue,station:val("station")||defaults.station,attendance:Math.max(100,Number(val("attendance"))||defaults.attendance),endTime:val("endTime")||defaults.endTime,share:Number(val("peakShare")||defaults.share),weather:val("weather")||defaults.weather,capacity:Number(val("trainCapacity")||defaults.capacity),interval:Number(val("baseInterval")||defaults.interval)};
  }
  function syncForm(d) {
    const map={eventName:d.eventName,venue:d.venue,station:d.station,attendance:d.attendance,endTime:d.endTime,peakShare:d.share,weather:d.weather,trainCapacity:d.capacity,baseInterval:d.interval};
    Object.entries(map).forEach(([id,v])=>{if($(id))$(id).value=v;});
  }
  function drawBars(target, scale=1) {
    if(!target)return;
    const vals=[.22,.37,.59,.94,.75,.45,.24],labels=["−60m","−30m","End","+15m","+30m","+45m","+60m"];
    target.innerHTML=vals.map((v,i)=>`<div class="${i===3?"peak":""}" style="height:${Math.min(98,v*scale*100)}%"><i></i><span>${labels[i]}</span></div>`).join("");
  }
  function refreshOverview() {
    const p=calc(read()), a=actions(p);
    const put=(id,v)=>{if($(id))$(id).textContent=v;};
    put("todayLabel",new Date().toLocaleDateString("en-US",{weekday:"long",day:"2-digit",month:"short"}).toUpperCase());
    put("heroCrowd",fmt(p.attendance));put("metricCrowd",fmt(p.attendance));put("metricDemand",fmt(p.adjusted));put("metricActions",a.length);
    put("metricRisk",p.risk);if($("metricRisk"))$("metricRisk").className=p.risk==="HIGH"?"risk-high":p.risk==="MEDIUM"?"risk-medium":"risk-low";
    put("eventSummaryTitle",p.eventName);put("summaryStation",p.station);put("summaryEnd",p.endTime);put("summaryHeadway",p.suggested+" minutes");
    put("summaryWeather",({normal:"Normal conditions",rain:"Heavy rain expected",heat:"Extreme heat"})[p.weather]);
    drawBars($("miniChart"),Math.min(1.15,Math.max(.65,p.adjusted/14000)));
    if($("miniChart"))$("miniChart").querySelectorAll("i").forEach((bar,i)=>{bar.style.height="100%";});
  }
  window.SurgeShield={KEY,defaults,read,save,calc,fmt,actions,escape,toast,getForm,syncForm,refreshOverview,drawBars};
  document.addEventListener("DOMContentLoaded",()=>{
    const page=document.body.dataset.page;
    if(page==="overview")refreshOverview();
    else if(page==="planner") { syncForm(read()); const p=calc(read()); const put=(id,v)=>{if($(id))$(id).textContent=v;};put("todayLabel",new Date().toLocaleDateString("en-US",{weekday:"long",day:"2-digit",month:"short"}).toUpperCase());put("metroDemand",fmt(p.adjusted));put("riskBadge",p.risk);if($("riskBadge"))$("riskBadge").className=p.risk==="HIGH"?"risk-high":p.risk==="MEDIUM"?"risk-medium":"risk-low";if($("demandBar"))$("demandBar").style.width=Math.min(100,p.adjusted/20000*100)+"%";}
    else {const d=$("todayLabel");if(d)d.textContent=new Date().toLocaleDateString("en-US",{weekday:"long",day:"2-digit",month:"short"}).toUpperCase();}
  });
})();