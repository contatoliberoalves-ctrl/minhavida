/* ===== Minha Vida — Seed Data ===== */
(function(){
// ---- Projetos / áreas ----
const PROJECTS = [
  { key:'mentorias', label:'Mentorias de Estudo', color:'var(--c-mentorias)', icon:'users',
    desc:'Acompanhamento individual de alunas e alunos.' },
  { key:'vde_concursos', label:'VDE Concursos', color:'var(--c-vdec)', icon:'target',
    desc:'Entrega de materiais e gravações de aulas.',
    sections:['Entrega de materiais','Gravações de aulas'] },
  { key:'vde1', label:'VDE 1ª Fase', color:'var(--c-vde1)', icon:'book',
    desc:'Materiais, aulas gravadas, aulas ao vivo e revisão nocaute.',
    sections:['Materiais','Aulas gravadas','Aulas ao vivo','Revisão nocaute'] },
  { key:'vde2', label:'VDE 2ª Fase', color:'var(--c-vde2)', icon:'layers',
    desc:'Turma regular, repescagem, mentorias e reuniões internas.',
    sections:['Aula de lançamento (regular)','Lançamento repescagem','Mentoria ao vivo','Gravação de aula','Reunião geral (ter 20h)','Reunião time de monitoras','Reunião monitores de simulados'] },
  { key:'pratflix', label:'Pratflix', color:'var(--c-pratflix)', icon:'play',
    desc:'Curso que vou lançar: criação, lançamento e continuidade.',
    sections:['Criação do curso','Lançamento','Continuidade'] },
  { key:'cartorio', label:'Cartório RCPN', color:'var(--c-cartorio)', icon:'stamp',
    desc:'Registro civil de pessoas naturais.' },
  { key:'conteudo', label:'Conteúdo Pessoal', color:'var(--c-conteudo)', icon:'camera',
    desc:'Instagram, TikTok e YouTube.',
    sections:['Instagram','TikTok','YouTube'] },
  { key:'renato', label:'Projeto Renato Torres', color:'var(--c-renato)', icon:'bookopen',
    desc:'Clube de leitura, produção de conteúdo e venda de livros.',
    sections:['Lançamentos clube de leitura','Produção de conteúdo','Venda de livros'] },
  { key:'constitucional', label:'Constitucional Gabaritado', color:'var(--c-constitucional)', icon:'scale',
    desc:'Produção de conteúdo no Instagram e materiais.',
    sections:['Conteúdo Instagram','Materiais'] },
  { key:'agencia', label:'Agência', color:'var(--c-agencia)', icon:'megaphone',
    desc:'Conteúdo Eduarda e outros clientes.',
    sections:['Conteúdo Eduarda','Outros clientes'] },
  { key:'pessoal', label:'Pessoal', color:'var(--c-pessoal)', icon:'heart',
    desc:'Compromissos pessoais, saúde e família.' },
  { key:'faculdade', label:'Faculdade', color:'oklch(0.6 0.1 210)', icon:'bookopen',
    desc:'Aulas, trabalhos e provas da Ana Cecília.',
    sections:['Aulas','Trabalhos e provas','Estágio'] },
];

// ---- Colaboradores ----
const COLLABS = [
  { id:'daniel', name:'Daniel', role:'Edição de vídeo e imagem · fotografia e gravação', rate:null, color:'var(--c-agencia)' },
  { id:'sefora', name:'Séfora', role:'Fotografia e gravação', rate:null, color:'var(--c-conteudo)' },
];

// ---- Compromissos (extraídos do Calendário 2026) ----
// project keys above. urgent flagged on milestones / launches.
const C = [];
let _id=1;
function add(date,time,title,project,opts={}){
  C.push(Object.assign({id:'c'+(_id++),date,time:time||null,title,project,done:false,urgent:false,desc:'',meet:false},opts));
}
// ---------- JUNHO 2026 ----------
add('2026-06-01','09:00','Mentoria — Gabriela','mentorias');
add('2026-06-01','11:00','Mentoria — Débora','mentorias');
add('2026-06-01','12:00','Live OAB 47','constitucional',{desc:'Live de conteúdo'});
add('2026-06-01','14:00','Mentoria — Thamyres','mentorias');
add('2026-06-01','15:00','Mentoria — Thiago','mentorias');
add('2026-06-01','19:00','VDE','vde2');
add('2026-06-02','15:00','Mentoria — Sara','mentorias');
add('2026-06-02','16:00','Mentoria — Cinara','mentorias');
add('2026-06-02','17:30','Reunião VDE','vde2',{meet:true});
add('2026-06-02','18:00','Simulados','vde2');
add('2026-06-03','10:00','Mentoria — Laisinha','mentorias');
add('2026-06-03','13:00','Reunião VDE','vde2',{meet:true});
add('2026-06-03','18:00','Simulados','vde2');
add('2026-06-03','19:00','Mentoria — Michelle','mentorias');
add('2026-06-04','10:00','Mentoria — Laisinha','mentorias');
add('2026-06-05','','Ida a Recife','pessoal');
add('2026-06-06','','Net Cartório','cartorio',{desc:'Manutenção mensal do cartório'});
add('2026-06-06','08:00','Revisão','vde1');
add('2026-06-06','11:30','Revisão','vde1');
add('2026-06-06','19:00','Jogo do Brasil','pessoal');
add('2026-06-08','','Prova ENAM','pessoal',{urgent:true,desc:'Exame Nacional da Magistratura'});
add('2026-06-08','12:00','Live nat','conteudo');
add('2026-06-09','','Fim 1ª etapa OAB 47','vde1');
add('2026-06-09','19:00','R. D. Material 02','vde_concursos',{desc:'Revisão de material'});
add('2026-06-10','11:30','Dentista','pessoal');
add('2026-06-11','10:00','Aula de Inglês','pessoal');
add('2026-06-11','11:00','Mentoria — Laisinha','mentorias');
add('2026-06-11','19:00','Ética','vde1');
add('2026-06-12','19:00','R. D. Processual 01','vde_concursos');
add('2026-06-13','09:00','Mentoria — Laisinha','mentorias');
add('2026-06-13','16:00','Mentoria — Michelle','mentorias');
add('2026-06-13','19:00','Jogo do Brasil','pessoal');
add('2026-06-15','','Prova do ENAC','pessoal',{urgent:true});
add('2026-06-15','','Defesa de Mestrado','pessoal',{urgent:true,desc:'Defesa da dissertação'});
add('2026-06-16','','Retorno SMBV','pessoal');
add('2026-06-16','08:00','Mentoria — Laisinha','mentorias');
add('2026-06-18','10:00','Aula de Inglês','pessoal');
add('2026-06-18','19:00','R. D. Processual 03','vde_concursos');
add('2026-06-19','','Ir a Petrolina','pessoal');
add('2026-06-19','10:00','Mentoria — Laisinha','mentorias');
add('2026-06-19','15:00','Mentoria — Gabriela','mentorias');
add('2026-06-19','16:00','Conteúdo — Eduarda','agencia',{desc:'Cliente da Agência'});
add('2026-06-20','09:00','Identificação','cartorio');
add('2026-06-20','15:00','Mentoria — Thiago','mentorias');
add('2026-06-20','16:00','Mentoria — Thamyres','mentorias');
add('2026-06-20','21:30','Jogo do Brasil','pessoal');
add('2026-06-22','','Aparelho','pessoal',{desc:'Ajuste do aparelho'});
add('2026-06-23','','2ª Fase da OAB','vde2',{urgent:true});
add('2026-06-23','10:00','L. Orar','vde1',{desc:'Lançamento'});
add('2026-06-23','20:00','Análise de Prova','vde2',{meet:true});
add('2026-06-24','10:00','Mentoria — Débora','mentorias');
add('2026-06-24','14:00','Mentoria — Cinara','mentorias');
add('2026-06-25','10:00','Aula de Inglês','pessoal');
add('2026-06-27','','Casamento Religioso 💍','pessoal',{urgent:true,desc:'Meu casamento'});
add('2026-06-30','','Viagem — Lua de Mel','pessoal',{desc:'Início da lua de mel'});
// ---------- JULHO 2026 ----------
add('2026-07-01','','Lua de mel','pessoal');
add('2026-07-04','','Net Cartório','cartorio');
add('2026-07-14','','Retorno de Petrolina','pessoal');
add('2026-07-16','','Resultado OAB','vde1',{urgent:true});
add('2026-07-16','','Recursos','vde2',{desc:'Período de recursos'});
add('2026-07-16','10:00','Mentoria — Débora','mentorias');
add('2026-07-16','14:00','Mentoria — Cinara','mentorias');
add('2026-07-16','15:00','Mentoria — Thamyres','mentorias');
add('2026-07-16','16:00','Mentoria — Gabriela','mentorias');
add('2026-07-18','12:00','Mentoria Coletiva','vde2',{meet:true});
add('2026-07-20','20:00','Aula Repescagem','vde2');
add('2026-07-21','13:00','Reunião VDE','vde2',{meet:true});
add('2026-07-23','10:00','Aula de Inglês','pessoal');
add('2026-07-23','12:00','Mentoria Coletiva','vde2',{meet:true});
add('2026-07-27','20:00','Aula Repescagem','vde2');
add('2026-07-29','','Resultado Final 2ª Fase','vde2',{urgent:true});
add('2026-07-30','10:00','Mentoria — Débora','mentorias');
add('2026-07-30','14:00','Mentoria — Cinara','mentorias');
add('2026-07-31','','Inscrição Repescagem','vde2',{urgent:true});
add('2026-07-31','','Workshop + Lançamento Pratflix','pratflix',{urgent:true,desc:'Marco do mês: lançamento'});
// ---------- AGOSTO 2026 ----------
add('2026-08-01','13:00','Reunião VDE','vde2',{meet:true});
add('2026-08-03','','Net Cartório','cartorio');
add('2026-08-06','10:00','Aula de Inglês','pessoal');
add('2026-08-07','','Gravar Simulado EXTRA VDE','vde_concursos');
add('2026-08-08','','Aparelho','pessoal');
add('2026-08-08','','Fim Inscrição Repescagem','vde2');
add('2026-08-10','','Gravar Simulado EXTRA VDE','vde_concursos');
add('2026-08-11','11:00','Dentista','pessoal');
add('2026-08-11','13:00','Reunião VDE','vde2',{meet:true});
add('2026-08-13','10:00','Aula de Inglês','pessoal');
add('2026-08-18','13:00','Reunião VDE','vde2',{meet:true});
add('2026-08-20','10:00','Aula de Inglês','pessoal');
add('2026-08-22','','Ida a Fortaleza','pessoal');
add('2026-08-31','19:00','Aula de Constitucional','constitucional');
add('2026-08-31','','Lançamento Saúde Mental + Maratona de Ética + Assinatura Insta','vde1',{desc:'Marco do mês'});
// ---------- SETEMBRO 2026 ----------
add('2026-09-03','09:00','Aula de Eleitoral','vde1');
add('2026-09-03','19:00','Aula de Ética','vde1');
add('2026-09-03','10:00','Aula de Inglês','pessoal');
add('2026-09-04','09:00','Revisão de Véspera','vde1');
add('2026-09-05','','Net Cartório','cartorio');
add('2026-09-07','07:30','L. Ética','vde1',{desc:'Lançamento'});
add('2026-09-07','10:30','L. Orar','vde1');
add('2026-09-12','','1ª Fase OAB 47','vde1',{urgent:true});
add('2026-09-12','20:00','Live Nat','conteudo');
add('2026-09-12','','Retorno SMBV','pessoal');
add('2026-09-13','20:00','L. Regular (lançamento turma regular)','vde2',{urgent:true});
add('2026-09-14','20:00','L. Regular','vde2');
add('2026-09-19','20:00','Aula VDE','vde2');
add('2026-09-22','','Inscrição OAB 48','vde1',{urgent:true});
add('2026-09-26','20:00','Aula VDE','vde2');
add('2026-09-30','','Fim da Inscrição OAB 48','vde1');
add('2026-09-30','20:00','Aula VDE','vde2');
// ---------- OUTUBRO 2026 ----------
add('2026-10-03','','Net Cartório','cartorio');
add('2026-10-09','19:00','R. D. Material 02','vde_concursos');
add('2026-10-10','19:00','R. D. Processual 01','vde_concursos');
add('2026-10-16','19:00','R. D. Processual 03','vde_concursos');
add('2026-10-17','19:00','R. Identificação','cartorio');
add('2026-10-17','09:00','Mentoria Final','vde2');
add('2026-10-24','10:00','L. Orar','vde1');
add('2026-10-24','','2ª Fase OAB 47','vde2',{urgent:true});
add('2026-10-25','20:00','Live Análise','vde2');
// ---------- NOVEMBRO 2026 ----------
add('2026-11-07','','Net Cartório','cartorio');
add('2026-11-07','','Workshop + Lançamento Pratflix','pratflix',{urgent:true,desc:'Marco do mês'});
add('2026-11-14','','Aniversário Local da UMADALPE','pessoal');
add('2026-11-21','','Aniversário Local da UMADALPE','pessoal');
add('2026-11-21','','Inscrição Repescagem OAB 48','vde2',{urgent:true});
add('2026-11-28','','Fim Inscrição Repescagem OAB 48','vde2');
// ---------- DEZEMBRO 2026 ----------
add('2026-12-05','','Net Cartório','cartorio');
add('2026-12-12','','Ida a Fortaleza','pessoal');
add('2026-12-18','19:00','Nocaute de Constitucional','vde1',{urgent:true});
add('2026-12-19','09:00','Nocaute de Eleitoral','vde1');
add('2026-12-19','19:00','Nocaute de Ética','vde1');
add('2026-12-19','09:00','Revisão de Véspera','vde1');
add('2026-12-19','','Golf Ville','pessoal');
add('2026-12-24','07:00','L. Ética','vde1');
add('2026-12-24','10:30','L. Orar','vde1');
add('2026-12-26','','1ª Fase OAB 48','vde1',{urgent:true});
add('2026-12-26','20:00','Live Nat','conteudo');
add('2026-12-26','','Retorno SMBV','pessoal');
add('2026-12-26','19:00','L. Boas-vindas','vde2');
add('2026-12-26','19:00','L. Resolução','vde2');
// ---------- 2027 (datas importantes) ----------
add('2027-01-10','','1ª Fase da OAB 48','vde1',{urgent:true,desc:'Data importante 2027'});
add('2027-02-21','','2ª Fase da OAB 48','vde2',{urgent:true,desc:'Data importante 2027'});

// ---- Tags financeiras ----
const EXPENSE_TAGS = [
  {id:'casa',label:'Casa',color:'oklch(0.58 0.08 250)'},
  {id:'alimentacao',label:'Alimentação',color:'oklch(0.64 0.12 38)'},
  {id:'entretenimento',label:'Entretenimento',color:'oklch(0.62 0.12 8)'},
  {id:'estudos',label:'Estudos e Concursos',color:'var(--olive)'},
  {id:'saude',label:'Saúde',color:'oklch(0.60 0.11 150)'},
  {id:'carro',label:'Carro',color:'oklch(0.52 0.06 300)'},
  {id:'sistemas',label:'Sistemas e Plataformas',color:'oklch(0.58 0.085 195)'},
  {id:'impostos',label:'Impostos e taxas',color:'oklch(0.55 0.10 285)'},
  {id:'cartorio',label:'Cartório',color:'oklch(0.56 0.10 320)'},
];
const INCOME_TAGS = [
  {id:'mentorias',label:'Mentorias',color:'var(--olive)'},
  {id:'vde1',label:'VDE 1ª fase',color:'oklch(0.60 0.085 195)'},
  {id:'vde2',label:'VDE 2ª Fase',color:'oklch(0.55 0.10 285)'},
  {id:'vdec',label:'VDE Concursos',color:'oklch(0.58 0.10 250)'},
  {id:'reforcos',label:'Reforços',color:'oklch(0.66 0.11 70)'},
  {id:'cartorio',label:'Cartório',color:'oklch(0.56 0.10 320)'},
];

// ---- Transações de exemplo (editáveis) ----
const TX = [
  // recebimentos
  {id:'t1',type:'income',date:'2026-06-05',desc:'Mensalidade VDE 2ª Fase',amount:8400,tag:'vde2'},
  {id:'t2',type:'income',date:'2026-06-10',desc:'Pacote de mentorias individuais',amount:3200,tag:'mentorias'},
  {id:'t3',type:'income',date:'2026-06-12',desc:'Reforços OAB',amount:1500,tag:'reforcos'},
  {id:'t4',type:'income',date:'2026-06-20',desc:'Repasse do Cartório',amount:6200,tag:'cartorio'},
  {id:'t5',type:'income',date:'2026-06-25',desc:'VDE Concursos — turma',amount:2750,tag:'vdec'},
  // gastos fixos
  {id:'t10',type:'expense',date:'2026-06-05',desc:'Aluguel + condomínio',amount:2600,tag:'casa',freq:'mensal'},
  {id:'t11',type:'expense',date:'2026-06-05',desc:'Plano de saúde',amount:680,tag:'saude',freq:'mensal'},
  {id:'t12',type:'expense',date:'2026-06-08',desc:'Assinaturas (edição, hospedagem, e-mail)',amount:430,tag:'sistemas',freq:'mensal'},
  {id:'t13',type:'expense',date:'2026-06-01',desc:'IPVA do carro',amount:1900,tag:'carro',freq:'anual'},
  {id:'t14',type:'expense',date:'2026-06-15',desc:'Anuidade OAB',amount:680,tag:'impostos',freq:'anual'},
  {id:'t15',type:'expense',date:'2026-06-03',desc:'Curso de inglês',amount:540,tag:'estudos',freq:'semestral'},
  // gastos diários
  {id:'t20',type:'expense',date:'2026-06-11',desc:'Mercado',amount:320,tag:'alimentacao',freq:'diario'},
  {id:'t21',type:'expense',date:'2026-06-12',desc:'Cinema com a Cecília',amount:90,tag:'entretenimento',freq:'diario'},
  {id:'t22',type:'expense',date:'2026-06-13',desc:'Combustível',amount:250,tag:'carro',freq:'diario'},
  {id:'t23',type:'expense',date:'2026-06-09',desc:'Dentista',amount:300,tag:'saude',freq:'diario'},
];

// ---- E-mails de exemplo (Gmail mock) ----
const EMAILS = [
  {id:'e1',from:'Equipe VDE',email:'monitoria@vde.com.br',subject:'Cronograma de gravações da 2ª fase',preview:'Oi! Seguem as datas sugeridas para gravarmos os simulados extras...',time:'09:12',unread:true,star:false,label:'vde2'},
  {id:'e2',from:'Cartório — Escrevente',email:'escrevente@cartorio.com',subject:'Pendências de registro desta semana',preview:'Bom dia, temos 3 registros aguardando sua assinatura e o net do mês...',time:'08:40',unread:true,star:true,label:'cartorio'},
  {id:'e3',from:'Eduarda',email:'eduarda@cliente.com',subject:'Aprovação do conteúdo de junho',preview:'Oi, tudo bem? Te mandei o roteiro dos 4 reels, pode dar uma olhada?',time:'Ontem',unread:true,star:false,label:'agencia'},
  {id:'e4',from:'Renato Torres',email:'contato@renatotorres.com',subject:'Clube de leitura — próximo lançamento',preview:'Vamos confirmar o livro do mês e a data da live de abertura?',time:'Ontem',unread:false,star:true,label:'renato'},
  {id:'e5',from:'Plataforma Pratflix',email:'no-reply@pratflix.com',subject:'Checklist de lançamento do curso',preview:'Faltam 3 itens para liberar a página de vendas do seu curso...',time:'Seg',unread:false,star:false,label:'pratflix'},
  {id:'e6',from:'Daniel (edição)',email:'daniel@equipe.com',subject:'Entrega: 2 vídeos editados',preview:'Subi os dois vídeos no Drive, dá uma conferida e me fala se aprova.',time:'Seg',unread:false,star:false,label:'agencia'},
  {id:'e7',from:'Banco',email:'noreply@banco.com',subject:'Sua fatura fecha em 3 dias',preview:'O valor parcial da sua fatura é de R$ ...',time:'Dom',unread:false,star:false,label:''},
];

window.SEED = { PROJECTS, COLLABS, COMMITMENTS:C, EXPENSE_TAGS, INCOME_TAGS, TX, EMAILS };
})();
