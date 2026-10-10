document.addEventListener("DOMContentLoaded",()=>{
 const app=window.SurgeShield,$=id=>document.getElementById(id);if(!app)return;
 const copyText={
 en:s=>`Attention passengers at ${s}: Due to the event crowd, please queue calmly, follow staff instructions, and keep platform access clear. Allow passengers to exit before boarding. Thank you for travelling with the metro.`,
 hi:s=>`${s} स्टेशन पर यात्रियों का ध्यान आकर्षित किया जाता है: कार्यक्रम के कारण भीड़ बढ़ सकती है। कृपया शांति से कतार में रहें, कर्मचारियों के निर्देशों का पालन करें और पहले यात्रियों को उतरने दें। मेट्रो से यात्रा करने के लिए धन्यवाद।`,
 gu:s=>`${s} સ્ટેશન પર મુસાફરોનું ધ્યાન દોરવામાં આવે છે: કાર્યક્રમને કારણે ભીડ વધી શકે છે. કૃપા કરીને શાંતિથી કતારમાં રહો, સ્ટાફની સૂચનાઓનું પાલન કરો અને પહેલા મુસાફરોને ઉતરવા દો. મેટ્રોમાં મુસાફરી કરવા બદલ આભાર.`
 };
 let lang="en";
 function update(){const station=$("stationSelect").value;$("announcementText").textContent=copyText[lang](station);$("languageLabel").textContent=({en:"ENGLISH · PA ANNOUNCEMENT",hi:"HINDI · PA ANNOUNCEMENT",gu:"GUJARATI · PA ANNOUNCEMENT"})[lang];}
 document.querySelectorAll(".language-tab").forEach(btn=>btn.addEventListener("click",()=>{lang=btn.dataset.lang;document.querySelectorAll(".language-tab").forEach(b=>b.classList.toggle("active",b===btn));update();}));
 $("stationSelect").addEventListener("change",update);
 $("copyAnnouncement").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("announcementText").textContent);}catch{const t=document.createElement("textarea");t.value=$("announcementText").textContent;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();}app.toast("Announcement copied");});
 $("downloadAnnouncement").addEventListener("click",()=>{const url=URL.createObjectURL(new Blob([$("announcementText").textContent],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download=`metro-announcement-${lang}.txt`;a.click();URL.revokeObjectURL(url);app.toast("Announcement downloaded");});
 update();
});