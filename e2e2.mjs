import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");let v=l.slice(i+1).trim();if(v.startsWith('"')&&v.endsWith('"'))v=v.slice(1,-1);return[l.slice(0,i).trim(),v]}));
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {auth:{autoRefreshToken:false,persistSession:false}});
const P = "C:/Users/chapo/AppData/Local/Temp/claude/C--Users-chapo-OneDrive-Desktop-De-Vuelta/66ea774a-60d0-495a-8769-102be651b205/scratchpad/petimg";

const mk = async (email) => (await admin.auth.admin.createUser({email, password:"PruebaSegura123", email_confirm:true})).data.user.id;
const owner = await mk("nicolas.test.v2owner@gmail.com");
const nb = await mk("nicolas.test.v2vecino@gmail.com");

const petPath = `${owner}/luna.jpg`;
await admin.storage.from("pet-photos").upload(petPath, readFileSync(`${P}/luna_perfil.jpg`), {contentType:"image/jpeg", upsert:true});
const petUrl = admin.storage.from("pet-photos").getPublicUrl(petPath).data.publicUrl;
const fx = `${nb}/fx-misma.jpg`;
await admin.storage.from("sighting-photos").upload(fx, readFileSync(`${P}/luna_crop.jpg`), {contentType:"image/jpeg", upsert:true});
const fxUrl = admin.storage.from("sighting-photos").getPublicUrl(fx).data.publicUrl;

const { data: pet } = await admin.from("pets").insert({owner_id:owner,name:"Luna",species:"dog",breed:"Chihuahua",color:"Negro con canela",photo_urls:[petUrl]}).select("id").single();
const { data: rep } = await admin.from("lost_reports").insert({pet_id:pet.id,reporter_id:owner,last_seen_lat:19.3899,last_seen_lng:-99.1707,last_seen_at:new Date(Date.now()-3600e3).toISOString()}).select("id").single();
console.log(JSON.stringify({reportId:rep.id, fxUrl}));
