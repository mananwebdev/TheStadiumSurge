document.addEventListener("DOMContentLoaded",()=>{
  const app=window.SurgeShield, $=id=>document.getElementById(id);
  if(!app)return;
  $("eventForm").addEventListener("submit",e=>{
    e.preventDefault();const d={...app.getForm()};app.save(d);const p=app.calc(d);
    $("metroDemand").textContent=app.fmt(p.adjusted);$("riskBadge").textContent=p.risk;
    $("riskBadge").className=p.risk==="HIGH"?"risk-high":p.risk==="MEDIUM"?"risk-medium":"risk-low";
    $("demandBar").style.width=Math.min(100,p.adjusted/20000*100)+"%";
    app.toast("Event saved — response plan updated");
    setTimeout(()=>location.href="action-plan.html",500);
  });
  $("resetForm").addEventListener("click",()=>{
    app.syncForm(app.defaults);app.save(app.defaults);const p=app.calc(app.defaults);
    $("metroDemand").textContent=app.fmt(p.adjusted);$("riskBadge").textContent=p.risk;
    $("riskBadge").className=p.risk==="HIGH"?"risk-high":p.risk==="MEDIUM"?"risk-medium":"risk-low";
    $("demandBar").style.width=Math.min(100,p.adjusted/20000*100)+"%";app.toast("Form reset to sample event");
  });
  $("attendance").addEventListener("input",()=>{const p=app.calc(app.getForm());$("metroDemand").textContent=app.fmt(p.adjusted);});
});