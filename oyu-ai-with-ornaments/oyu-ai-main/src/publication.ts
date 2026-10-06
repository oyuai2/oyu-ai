import { strToU8, zipSync } from 'fflate'
import { db } from './db'
import { loadPublicData } from './publicData'
import type { DiaryEntry, Experiment, ImageRecord, PublicJournal, PublicResearch } from './types'

const safeName=(name:string)=>name.replace(/[^a-zA-Z0-9._-]+/g,'-')
const json=(value:unknown)=>strToU8(JSON.stringify(value,null,2))
export async function buildPublicationPackage(){
  const currentPublic=await loadPublicData()
  const images=(await db.all<ImageRecord>('images')).filter(x=>x.publishApproved&&x.permission.trim().length>0)
  const experiments=(await db.all<Experiment>('experiments')).filter(x=>x.publishApproved)
  const diary=(await db.all<DiaryEntry>('diary')).filter(x=>x.publishApproved)
  const publishedAt=new Date().toISOString()
  const files:Record<string,Uint8Array>={
    'public/data/ornaments.json':json(currentPublic.ornaments),
    'public/data/research-results.json':json({version:1,publishedAt,experiments} satisfies PublicResearch),
    'public/data/published-journal.json':json({version:1,publishedAt,entries:diary} satisfies PublicJournal),
    'public/models/oyu-ai/model-info.json':json(currentPublic.model),
    'PUBLICATION-CHECKLIST.txt':strToU8('OYU AI publication package\n\n1. Review every file for personal data.\n2. Copy public/data and public/images into the project.\n3. Add the exported Teachable Machine files to public/models/oyu-ai.\n4. Set available=true and labels in model-info.json.\n5. Run npm run typecheck and npm run build.\n6. Commit and push to GitHub.\n')
  }
  for(const image of images){files[`public/images/ornaments/${image.ornament}/${image.id}-${safeName(image.fileName)}`]=new Uint8Array(await image.blob.arrayBuffer())}
  files['public/data/published-images.json']=json(images.map(({blob,...x})=>({...x,path:`images/ornaments/${x.ornament}/${x.id}-${safeName(x.fileName)}`})))
  return zipSync(files,{level:6})
}
