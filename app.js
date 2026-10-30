/* LexMatch AI - front-end demonstration storage only.
   For real multi-user accounts and shared database access, connect a secure backend/API. */
(function(){
 const read=(k,fallback=[])=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fallback))}catch{return fallback}};
 const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 const byId=id=>document.getElementById(id);
 const show=(id,msg)=>{const el=byId(id);if(el)el.textContent=msg};
 // Registration: store a demo user in this browser. Do not use real passwords in this prototype.
 document.addEventListener('submit',function(e){
  const form=e.target;
  if(form.id==='registerForm'){
   e.preventDefault();e.stopImmediatePropagation();
   const d=new FormData(form),name=(d.get('name')||'').trim(),email=(d.get('email')||'').trim().toLowerCase(),password=d.get('password')||'',confirm=d.get('confirmPassword')||'';
   if(password.length<6||password!==confirm){show('registerStatus','Please check that both passwords match and contain at least 6 characters.');return;}
   const users=read('lexmatch_users');if(users.some(u=>u.email===email)){show('registerStatus','This email is already registered in this browser. Please log in.');return;}
   users.push({name,email,phone:d.get('phone')||'',type:d.get('type')||'User',password});write('lexmatch_users',users);
   show('registerStatus','Registration saved in this browser. You can now log in.');form.reset();return;
  }
  if(form.id==='loginForm'){
   e.preventDefault();e.stopImmediatePropagation();
   const email=(byId('email')?.value||'').trim().toLowerCase(),password=byId('password')?.value||'';
   const user=read('lexmatch_users').find(u=>u.email===email&&u.password===password);
   if(!user){const err=byId('errorMessage');if(err){err.textContent='Account not found or password is incorrect. Register first in this browser.';err.style.display='block';}return;}
   write('lexmatch_current_user',{name:user.name,email:user.email,phone:user.phone,type:user.type});location.href='user_dashboard.html';return;
  }
  if(form.id==='contactForm'){
   e.preventDefault();e.stopImmediatePropagation();const inputs=form.querySelectorAll('input,textarea');
   const items=read('lexmatch_messages');items.push({name:inputs[0]?.value,email:inputs[1]?.value,subject:inputs[2]?.value,message:inputs[3]?.value,date:new Date().toLocaleString()});write('lexmatch_messages',items);form.reset();alert('Your message has been saved in this browser demo.');return;
  }
  if(form.id==='feedbackForm'){
   e.preventDefault();e.stopImmediatePropagation();const inputs=form.querySelectorAll('input,select,textarea');const stars=[...document.querySelectorAll('.star')].filter(x=>x.classList.contains('selected')).length;
   const items=read('lexmatch_feedback');items.push({name:inputs[0]?.value,email:inputs[1]?.value,rating:stars,type:inputs[2]?.value,feedback:inputs[3]?.value,date:new Date().toLocaleString()});write('lexmatch_feedback',items);form.reset();document.querySelectorAll('.star').forEach(x=>x.classList.remove('selected'));alert('Feedback saved in this browser demo. Thank you!');return;
  }
  if(form.id==='profileForm'){
   e.preventDefault();const cur=read('lexmatch_current_user',{});cur.name=byId('profileFullName').value.trim();cur.phone=byId('profilePhone').value.trim();write('lexmatch_current_user',cur);const users=read('lexmatch_users');const i=users.findIndex(u=>u.email===cur.email);if(i>=0){users[i].name=cur.name;users[i].phone=cur.phone;write('lexmatch_users',users);}show('profileStatus','Profile updated in this browser.');byId('profileName').textContent=cur.name;return;
  }
 },true);
 // Profile details
 const current=read('lexmatch_current_user',null);
 if(current&&byId('profileName')){byId('profileName').textContent=current.name;byId('profileEmail').textContent=current.email;byId('profileFullName').value=current.name;byId('profileEmailInput').value=current.email;byId('profilePhone').value=current.phone||'';byId('profileType').value=current.type||'User';}
 // Dashboard values and activity
 if(byId('welcomeName')){const u=current||{};byId('welcomeName').textContent='Welcome back, '+(u.name||'Guest')+'!';const qs=read('lexmatch_questions');byId('questionCount').textContent=qs.length;byId('feedbackCount').textContent=read('lexmatch_feedback').length;const recent=[...qs].slice(-5).reverse();byId('recentActivity').innerHTML=recent.length?recent.map(x=>'<p>'+escapeHtml(x.question)+' <small>('+escapeHtml(x.date)+')</small></p>').join(''):'Your recent activity will appear here.';}
 // Chat demo stores question history but is not connected to an AI model or legal database.
 const chatForm=byId('chatForm');if(chatForm){chatForm.addEventListener('submit',function(e){e.preventDefault();const input=byId('messageInput'),text=input.value.trim();if(!text)return;const qs=read('lexmatch_questions');qs.push({question:text,date:new Date().toLocaleString()});write('lexmatch_questions',qs);});}
 document.querySelectorAll('[data-logout]').forEach(a=>a.addEventListener('click',()=>localStorage.removeItem('lexmatch_current_user')));
 function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
})();