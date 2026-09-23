import { openDB } from 'idb'
import type { DiaryEntry, Experiment, ImageRecord, ReportData } from './types'
const dbp = openDB('oyu-ai-research',1,{upgrade(db){for(const name of ['images','experiments','diary','report'] as const) if(!db.objectStoreNames.contains(name)) db.createObjectStore(name,{keyPath:'id'})}})
export const db = {
  all: async <T>(store:string) => (await dbp).getAll(store) as Promise<T[]>,
  put: async <T>(store:string,value:T) => (await dbp).put(store,value),
  del: async (store:string,id:string) => (await dbp).delete(store,id),
  clear: async (store:string) => (await dbp).clear(store),
}
export async function exportBackup(){const data={version:1,exportedAt:new Date().toISOString(),images:await db.all<ImageRecord>('images'),experiments:await db.all<Experiment>('experiments'),diary:await db.all<DiaryEntry>('diary'),report:await db.all<ReportData & {id:string}>('report')}; const serial={...data,images:await Promise.all(data.images.map(async x=>({...x,blob:await blobToDataUrl(x.blob)})))};return JSON.stringify(serial,null,2)}
const blobToDataUrl=(b:Blob)=>new Promise<string>((ok,fail)=>{const r=new FileReader();r.onload=()=>ok(String(r.result));r.onerror=()=>fail(r.error);r.readAsDataURL(b)})
const dataUrlToBlob=async(s:string)=>(await fetch(s)).blob()
export async function importBackup(raw:string){const data=JSON.parse(raw);if(data.version!==1||!Array.isArray(data.images)) throw new Error('backup');for(const s of ['images','experiments','diary','report'])await db.clear(s);for(const x of data.images)await db.put('images',{...x,blob:await dataUrlToBlob(x.blob)});for(const s of ['experiments','diary','report'] as const)for(const x of data[s]||[])await db.put(s,x)}
