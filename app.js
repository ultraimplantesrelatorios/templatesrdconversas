(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const scenarios = window.ULTRA_SCENARIOS || [];
  let taskData = JSON.parse(localStorage.getItem('ultra_rd_latest') || 'null');

  const titles = {central:'Central', copiloto:'Copiloto', biblioteca:'Biblioteca', importar:'Importar RD', gestao:'Gestão · Milena', treinamento:'Treinamento'};
  function go(view){
    $$('.view').forEach(v=>v.classList.remove('active')); $('#view-'+view).classList.add('active');
    $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    $('#pageTitle').textContent=titles[view];
    closeMenu(); window.scrollTo({top:0,behavior:'smooth'});
    if(view==='gestao') renderManagement('hoje');
  }
  $$('.nav-item').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
  $$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
  $('#menuBtn').addEventListener('click',()=>{ $('#sidebar').classList.add('open'); $('#scrim').classList.add('show'); });
  $('#scrim').addEventListener('click',closeMenu); function closeMenu(){ $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('show'); }

  function normalize(s=''){ return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(); }
  const rules = [
    ['pouco-osso', /pouco osso|sem osso|nao tenho osso|não tenho osso|zigomatic|zigomát/],
    ['idade', /\b(6\d|7\d|8\d|9\d)\s*anos|velh[oa]|idade.*implante/],
    ['medo', /medo|receio|ansiedad|anestesia|cirurgia.*(medo|receio)|trauma/],
    ['preco', /quanto custa|qual.*valor|pre[cç]o|quanto.*implante/],
    ['fup-preco', /achei caro|muito caro|valor.*alto|caro demais/],
    ['fup-familia', /falar com|minha esposa|meu marido|meu filho|minha filha|familia/],
    ['familiar', /minha mae|minha mãe|meu pai|para meu pai|para minha mae|para minha mãe/],
    ['protese', /dentadura|protese removivel|prótese removível|chapa/],
    ['um-dente', /perdi um dente|falta um dente|um dente perdido/],
    ['varios-dentes', /perdi varios|perdi vários|faltam varios|faltam vários|muitos dentes/],
    ['experiencia-ruim', /experiencia ruim|experiência ruim|cirurgia.*horrivel|horrível|trauma anterior/],
    ['barreira-pratica', /transporte|acompanhante|dependo da|minha filha.*levar|horario dificil|horário difícil/],
    ['noshow', /nao fui|não fui|faltei|perdi a consulta/],
    ['pos-avaliacao', /ja passei.*avali|já passei.*avali|fiz a avali/],
    ['pensar', /quero pensar|vou pensar|nao e o momento|não é o momento/],
    ['retorno-data', /me chama|retorna.*mes|retorna.*semana|fala comigo.*depois/],
    ['comparando', /outra clinica|outra clínica|comparando|orcamento em outro|orçamento em outro/],
    ['oi', /^\s*(oi+|ola|olá|bom dia|boa tarde|boa noite)[!. ]*$/i],
    ['clinica', /posso fazer|tenho indicacao|tenho indicação|qual tratamento|isso e normal|isso é normal|meu exame/],
    ['lead-implante', /implante|dente fixo|dentes fixos/]
  ];
  function classify(text){ const n=normalize(text); for(const [id,rx] of rules){ if(rx.test(n)) return scenarios.find(s=>s.id===id); } return null; }
  function humanize(template,name,agent){ return (template||'').replaceAll('{{primeiro_nome}}',name||'').replaceAll('{{nome_atendente}}',agent||'equipe Ultra').replace(/\s+,/g,',').replace(/Oi, \./,'Oi.'); }
  $('#analyzeBtn').addEventListener('click',()=>{
    const text=$('#patientText').value.trim(); if(!text){ $('#patientText').focus(); return; }
    const sc=classify(text); const name=$('#patientName').value.trim(); const agent=$('#agentName').value.trim();
    const out=$('#copilotResult');
    if(!sc){ out.innerHTML=`<div class="analysis-block"><label>Leitura principal</label><p>Precisa de mais contexto. A mensagem ainda não permite classificar a barreira com segurança.</p></div><div class="recommended"><label>Melhor próximo passo</label><p>Entendi. Me conta um pouco mais do que você gostaria de resolver hoje, para eu não te orientar de forma genérica.</p></div><div class="analysis-block"><label>Regra</label><p>Uma pergunta por vez. Não inventar intenção, diagnóstico ou urgência.</p></div>`; return; }
    const limit = /sim/i.test(sc.clinicalLimit);
    out.innerHTML=`
      <div class="analysis-block"><label>Leitura principal</label><p><strong>${escapeHtml(sc.title)}</strong> · ${escapeHtml(sc.category||'Cenário reconhecido')}</p></div>
      <div class="analysis-block"><label>Como pensar</label><p>${escapeHtml(sc.think||'Use o contexto e não faça o paciente repetir o que já informou.')}</p></div>
      <div class="analysis-block"><label>Melhor pergunta agora</label><p>${escapeHtml(sc.bestQuestion||'Qual é o ponto mais importante para você agora?')}</p></div>
      <div class="recommended"><label>Resposta recomendada</label><p>${escapeHtml(humanize(sc.responseB,name,agent) || 'Vou te acompanhar por aqui. Me conta só o ponto principal para eu conseguir orientar você com segurança.')}</p></div>
      <div class="analysis-block"><label>Evitar</label><p>${escapeHtml(sc.avoid||'Não diagnosticar, não prometer resultado e não pressionar.')}</p></div>
      <div class="analysis-block"><label>Registrar no RD</label><p>${escapeHtml(sc.register||'Contexto + barreira + combinado + próxima ação.')}</p></div>
      <div class="analysis-block"><label>Limite clínico</label><span class="risk-tag ${limit?'':'safe-tag'}">${limit?'ENCAMINHAR / AVALIAÇÃO PROFISSIONAL':'SEM GATILHO CLÍNICO PRINCIPAL'}</span></div>`;
  });

  function escapeHtml(v=''){ return String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function renderLibrary(filter=''){
    const q=normalize(filter); const grid=$('#scenarioGrid');
    const list=scenarios.filter(s=>!q || normalize(JSON.stringify(s)).includes(q));
    grid.innerHTML=list.map(s=>`<article class="scenario"><span class="category">${escapeHtml(s.category||'Cenário')}</span><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.objective||s.think||'Cenário validado na Base Mestre.')}</p><button data-id="${s.id}">Ver orientação →</button></article>`).join('') || '<div class="empty-state">Nenhum cenário encontrado.</div>';
    $$('[data-id]',grid).forEach(btn=>btn.addEventListener('click',()=>showScenario(btn.dataset.id,btn.closest('.scenario'))));
  }
  function showScenario(id,card){
    $('.scenario-detail')?.remove(); const s=scenarios.find(x=>x.id===id); if(!s)return;
    const d=document.createElement('article'); d.className='scenario-detail'; d.innerHTML=`<h3>${escapeHtml(s.title)}</h3><dl><dt>Como pensar</dt><dd>${escapeHtml(s.think)}</dd><dt>Melhor pergunta</dt><dd>${escapeHtml(s.bestQuestion)}</dd><dt>Resposta padrão</dt><dd>${escapeHtml(s.responseB)}</dd><dt>Evitar</dt><dd>${escapeHtml(s.avoid)}</dd><dt>Registrar</dt><dd>${escapeHtml(s.register)}</dd><dt>Limite clínico</dt><dd>${escapeHtml(s.clinicalLimit)}</dd></dl>`;
    card.after(d); d.scrollIntoView({behavior:'smooth',block:'center'});
  }
  $('#librarySearch').addEventListener('input',e=>renderLibrary(e.target.value)); renderLibrary();

  const drop=$('#dropzone'), input=$('#fileInput');
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('drag')}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('drag')}));
  drop.addEventListener('drop',e=>e.dataTransfer.files[0]&&importFile(e.dataTransfer.files[0])); input.addEventListener('change',e=>e.target.files[0]&&importFile(e.target.files[0]));
  function parseCSV(text){
    text=text.replace(/^\uFEFF/,''); let lines=text.split(/\r?\n/).filter((l,i)=>!(i===0&&/^sep=/.test(l)));
    if(!lines.length)return []; const delim=(lines[0].match(/;/g)||[]).length>(lines[0].match(/,/g)||[]).length?';':',';
    const parseLine=line=>{let a=[],cur='',q=false;for(let i=0;i<line.length;i++){let c=line[i];if(c==='"'){if(q&&line[i+1]==='"'){cur+='"';i++;}else q=!q;}else if(c===delim&&!q){a.push(cur);cur='';}else cur+=c;}a.push(cur);return a};
    const head=parseLine(lines[0]).map(x=>x.trim()); return lines.slice(1).filter(Boolean).map(l=>{const v=parseLine(l),o={};head.forEach((h,i)=>o[h]=v[i]??'');return o;});
  }
  function findField(row,candidates){ const keys=Object.keys(row); for(const c of candidates){const k=keys.find(k=>normalize(k)===normalize(c));if(k)return k;} return null; }
  function family(subject=''){ const s=normalize(subject); if(/confirm/.test(s))return'CONFIRMAÇÃO'; if(/reagend|remarc/.test(s))return'REMARCAÇÃO'; if(/agend/.test(s))return'AGENDAMENTO'; if(/finance|pagamento|boleto/.test(s))return'FINANCEIRO'; if(/pos|pós|revis/.test(s))return'PÓS-AVALIAÇÃO'; if(/encerr/.test(s))return'ENCERRAMENTO'; if(/entrar em contato|tent|follow|retom|ligar|contato/.test(s))return'FOLLOW-UP'; return'OUTROS'; }
  function brDate(d,t='00:00'){ if(!d)return null; const m=String(d).match(/(\d{2})\/(\d{2})\/(\d{4})/); if(!m)return null; return new Date(`${m[3]}-${m[2]}-${m[1]}T${t||'00:00'}:00`); }
  async function importFile(file){
    const text=await file.text(); const rows=parseCSV(text); if(!rows.length){alert('Não consegui ler registros deste CSV.');return;}
    const sample=rows[0], f={subject:findField(sample,['Assunto']),status:findField(sample,['Status']),desc:findField(sample,['Descrição','Descricao']),responsible:findField(sample,['Responsáveis','Responsaveis']),creator:findField(sample,['Usuário que criou','Usuario que criou']),scheduledDate:findField(sample,['Data agendada']),scheduledTime:findField(sample,['Hora agendada']),deal:findField(sample,['Negociação vinculada','Negociacao vinculada']),doneDate:findField(sample,['Data da conclusão','Data da conclusao'])};
    const now=new Date(); const enriched=rows.map((r,i)=>{const due=brDate(r[f.scheduledDate],r[f.scheduledTime]); const status=normalize(r[f.status]); return {...r,_id:i,_family:family(r[f.subject]),_late:!!due&&due<now&&!/conclu/.test(status),_noDesc:!String(r[f.desc]||'').trim(),_noOwner:!String(r[f.responsible]||'').trim(),_due:due?due.toISOString():null};});
    taskData={file:file.name, importedAt:new Date().toISOString(),fields:f,rows:enriched}; localStorage.setItem('ultra_rd_latest',JSON.stringify(taskData));
    const history=JSON.parse(localStorage.getItem('ultra_rd_history')||'[]'); history.unshift({file:file.name,importedAt:taskData.importedAt,total:rows.length,late:enriched.filter(x=>x._late).length,noDesc:enriched.filter(x=>x._noDesc).length}); localStorage.setItem('ultra_rd_history',JSON.stringify(history.slice(0,12)));
    renderAll(); go('importar');
  }
  function stats(){ if(!taskData)return null; const r=taskData.rows,f=taskData.fields; return {total:r.length,done:r.filter(x=>/conclu/.test(normalize(x[f.status]))).length,late:r.filter(x=>x._late).length,noDesc:r.filter(x=>x._noDesc).length,noOwner:r.filter(x=>x._noOwner).length,families:Object.entries(r.reduce((a,x)=>(a[x._family]=(a[x._family]||0)+1,a),{})).sort((a,b)=>b[1]-a[1]), creators:Object.entries(r.reduce((a,x)=>{const n=x[f.creator]||'Não informado';a[n]=(a[n]||0)+1;return a},{})).sort((a,b)=>b[1]-a[1])}; }
  function renderCentral(){ const s=stats(); if(!s)return; $('#kpiTotal').textContent=s.total; $('#kpiDone').textContent=s.done; $('#kpiLate').textContent=s.late; $('#kpiNoDesc').textContent=`${Math.round(s.noDesc/s.total*100)}%`;
    $('#qualityList').innerHTML=`<div><span>Descrição preenchida</span><strong>${100-Math.round(s.noDesc/s.total*100)}%</strong></div><div><span>Responsável identificado</span><strong>${100-Math.round(s.noOwner/s.total*100)}%</strong></div><div><span>Nomenclatura normalizada</span><strong>${s.families.length} famílias</strong></div>`;
    const late=taskData.rows.filter(x=>x._late).slice(0,6),f=taskData.fields; $('#actionNow').innerHTML=late.length?late.map(x=>`<div class="analysis-block"><label>${escapeHtml(x._family)}</label><p><strong>${escapeHtml(x[f.deal]||'Sem negociação')}</strong><br>${escapeHtml(x[f.subject]||'Tarefa sem assunto')} · ${escapeHtml(x[f.scheduledDate]||'')}</p></div>`).join(''):'<div class="empty-state">Nenhuma tarefa vencida encontrada na importação.</div>';
  }
  function renderImport(){ const s=stats(), box=$('#importSummary'); if(!s){box.classList.add('hidden');return;} box.classList.remove('hidden'); const f=taskData.fields; const late=taskData.rows.filter(x=>x._late).slice(0,30);
    box.innerHTML=`<div class="import-results"><article class="card"><div class="section-head"><div><span class="eyebrow">IMPORTAÇÃO CONCLUÍDA</span><h3>${escapeHtml(taskData.file)}</h3></div><strong>${s.total} registros</strong></div><div class="chip-row">${Object.keys(taskData.rows[0]).filter(k=>!k.startsWith('_')).map(k=>`<span class="chip">${escapeHtml(k)}</span>`).join('')}</div></article><div class="kpi-grid"><article class="kpi"><span>Total</span><strong>${s.total}</strong></article><article class="kpi"><span>Concluídas</span><strong>${s.done}</strong></article><article class="kpi alert"><span>Atrasadas</span><strong>${s.late}</strong></article><article class="kpi"><span>Sem descrição</span><strong>${Math.round(s.noDesc/s.total*100)}%</strong></article></div><article class="card"><h3>Famílias operacionais</h3><div class="chip-row">${s.families.map(([n,v])=>`<span class="chip"><strong>${n}</strong> · ${v}</span>`).join('')}</div></article><article class="card"><h3>Tarefas vencidas</h3>${late.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Negociação</th><th>Assunto</th><th>Família</th><th>Data</th><th>Responsável</th></tr></thead><tbody>${late.map(x=>`<tr class="late-row"><td>${escapeHtml(x[f.deal])}</td><td>${escapeHtml(x[f.subject])}</td><td>${x._family}</td><td>${escapeHtml(x[f.scheduledDate])}</td><td>${escapeHtml(x[f.responsible])}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state">Nenhuma tarefa vencida.</div>'}</article></div>`;
  }
  function renderManagement(panel='hoje'){ const s=stats(), el=$('#managementPanel'); if(!s){el.innerHTML='<div class="empty-state">Importe um relatório do RD para preencher o painel.</div>';return;} const f=taskData.fields;
    if(panel==='hoje') el.innerHTML=`<div class="kpi-grid"><article class="kpi"><span>Tarefas importadas</span><strong>${s.total}</strong></article><article class="kpi"><span>Follow-ups</span><strong>${(s.families.find(x=>x[0]==='FOLLOW-UP')||['',0])[1]}</strong></article><article class="kpi alert"><span>Vencidas</span><strong>${s.late}</strong></article><article class="kpi"><span>Sem descrição</span><strong>${s.noDesc}</strong></article></div>`;
    if(panel==='atencao') el.innerHTML=`<h3>Atenção</h3><div class="metric-list"><div><span>Tarefas vencidas</span><strong>${s.late}</strong></div><div><span>Sem descrição/contexto</span><strong>${s.noDesc}</strong></div><div><span>Sem responsável</span><strong>${s.noOwner}</strong></div><div><span>Métrica de resposta/agendamento</span><strong>dados insuficientes</strong></div></div>`;
    if(panel==='equipe') el.innerHTML=`<h3>Atividades por usuário que criou</h3><p class="muted">Isto mede registro/volume, não conversão.</p><div class="metric-list">${s.creators.map(([n,v])=>`<div><span>${escapeHtml(n)}</span><strong>${v}</strong></div>`).join('')}</div>`;
    if(panel==='evolucao'){const hist=JSON.parse(localStorage.getItem('ultra_rd_history')||'[]'); el.innerHTML=`<h3>Evolução das importações</h3>${hist.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Data</th><th>Arquivo</th><th>Total</th><th>Atrasadas</th><th>Sem descrição</th></tr></thead><tbody>${hist.map(h=>`<tr><td>${new Date(h.importedAt).toLocaleString('pt-BR')}</td><td>${escapeHtml(h.file)}</td><td>${h.total}</td><td>${h.late}</td><td>${h.noDesc}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state">Faça mais de uma importação para comparar evolução.</div>'}`;}
  }
  $$('.tab').forEach(b=>b.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderManagement(b.dataset.panel)}));
  $('#clearLocal').addEventListener('click',()=>{ if(confirm('Limpar importações salvas neste navegador?')){localStorage.removeItem('ultra_rd_latest');localStorage.removeItem('ultra_rd_history');taskData=null;location.reload();}});
  function renderAll(){renderCentral();renderImport();renderManagement('hoje')} renderAll();
})();
