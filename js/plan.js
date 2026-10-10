document.addEventListener("DOMContentLoaded",()=>{
 const app=window.SurgeShield,$=id=>document.getElementById(id);if(!app)return;
 const p=app.calc(app.read()),list=app.actions(p);
 $("planTitle").textContent=p.eventName+" · response plan";
 $("summaryPriority").textContent=p.risk;$("summaryPriority").className=p.risk==="HIGH"?"risk-high":p.risk==="MEDIUM"?"risk-medium":"risk-low";
 $("summaryDemand").textContent=app.fmt(p.adjusted)+" people";$("summaryHeadway").textContent=p.suggested+" minutes";$("summaryEnd").textContent=p.endTime;
 $("timeline").innerHTML=list.map(a=>`<article class="timeline-item"><div class="time-mark">${a.time}<span>MIN</span></div><div class="timeline-node" style="border-color:${({blue:"#8ca4ff",orange:"#ffae67",red:"#ee727b",green:"#42c8a0"})[a.tone]}"></div><div class="timeline-content"><div class="timeline-title"><b>${app.escape(a.title)}</b><span class="tag tag-${a.tone}">${a.tag}</span></div><p>${app.escape(a.body)}</p><label class="task-check"><input type="checkbox"><span>Mark action complete</span></label></div></article>`).join("");
 const boxes=()=>[...document.querySelectorAll("#timeline input[type=checkbox]")];
 function progress(){const all=boxes(),done=all.filter(x=>x.checked).length,pct=all.length?Math.round(done/all.length*100):0;$("progressBar").style.width=pct+"%";$("progressPill").textContent=pct+"% COMPLETE";boxes().forEach(x=>x.closest(".timeline-item").classList.toggle("completed",x.checked));}
 $("timeline").addEventListener("change",progress);
 $("resetChecklist").addEventListener("click",()=>{boxes().forEach(x=>x.checked=false);progress();app.toast("Checklist reset");});
 $("exportPlan").addEventListener("click",()=>{
  const report=["SURGESHIELD — METRO CROWD RESPONSE PLAN",`Event: ${p.eventName}`,`Station: ${p.station}`,`Attendance: ${app.fmt(p.attendance)}`,`Estimated metro demand: ${app.fmt(p.adjusted)}`,`Event ends: ${p.endTime}`,`Risk: ${p.risk}`,`Suggested planning headway: ${p.suggested} minutes`,"","ACTION TIMELINE",...list.map(a=>`${a.time} MIN | ${a.tag} | ${a.title}\n${a.body}`),"","DISCLAIMER: Demo assumptions only. Not live operational guidance; authorised metro control approval is required."].join("\n");
  const url=URL.createObjectURL(new Blob([report],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download="surgeshield-crowd-plan.txt";a.click();URL.revokeObjectURL(url);app.toast("Plan exported as a text file");
 });
 progress();
});