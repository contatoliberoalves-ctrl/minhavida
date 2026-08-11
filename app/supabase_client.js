/* ===== Minha Vida — cliente Supabase (sem build step) ===== */
(function(){
  var SUPABASE_URL = 'https://qijziqjpvtjwarkodzxp.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_l1_inEQengxOekYR4UZx7A_Ljxb3yGg';

  // persistSession/autoRefreshToken já são o padrão do Supabase, mas deixamos explícito:
  // a sessão fica salva no localStorage do navegador e é renovada sozinha,
  // então o login permanece válido entre visitas até a pessoa clicar em "Sair".
  window.SB = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  window.MV_FUNCTIONS_URL = SUPABASE_URL + '/functions/v1';

  window.mvCallFunction = async function(name, body){
    const { data } = await window.SB.auth.getSession();
    const token = data && data.session ? data.session.access_token : null;
    if(!token) throw new Error('Você precisa estar logado.');
    const res = await fetch(window.MV_FUNCTIONS_URL + '/' + name, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(body||{}),
    });
    let json = {};
    try{ json = await res.json(); }catch(e){}
    if(!res.ok) throw new Error(json.error || ('Erro ' + res.status));
    return json;
  };
})();
