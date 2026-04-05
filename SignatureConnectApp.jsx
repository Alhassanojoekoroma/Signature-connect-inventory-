import { useState } from "react";

const A = "#AAEF35";
const DB = "#0F0F0F";
const DC = "#1B1B1B";
const DC2 = "#252525";
const BR = "#2D2D2D";
const MU = "#717171";

const PRODUCTS = [
  { id:1, name:"769XR XPON Router",       cat:"Router",     serials:["XPONDD87A2D2","XPONDD87A3A2","XPONDD87A432"], stock:8,  status:"In Stock"     },
  { id:2, name:"Nokia ONU",               cat:"ONU",        serials:["NK-ONU-001","NK-ONU-002"],                    stock:10, status:"In Stock"     },
  { id:3, name:"Mikrotik 951",            cat:"Router",     serials:["HKB0AMS5SH3","HKB0AVX59HR"],                 stock:2,  status:"Low Stock"    },
  { id:4, name:"Black ONT",              cat:"ONT",        serials:["ALCLF9DE9961"],                               stock:1,  status:"Low Stock"    },
  { id:5, name:"Fiber Connectors",        cat:"Consumable", serials:[],                                             stock:60, status:"In Stock"     },
  { id:6, name:"D-Link Router",           cat:"Router",     serials:["DL-WR001"],                                  stock:0,  status:"Out of Stock" },
  { id:7, name:"Sig. Connect ONT 122XR",  cat:"ONT",        serials:["SC-122XR-001","SC-122XR-002"],               stock:2,  status:"Low Stock"    },
];

const TX = [
  { product:"769XR XPON Router",  serial:"XPONDD87A2D2",      action:"Issued",   to:"Fred",  date:"12 Mar", status:"In Field"  },
  { product:"Tender Router",       serial:"230368950110005593", action:"Returned", by:"Foday", date:"13 Mar", status:"Returned", cond:"Faulty" },
  { product:"Fiber Connectors",    serial:null,                action:"Stock In", qty:50,     date:"12 Mar", status:"Received"  },
  { product:"Black ONT",           serial:"ALCLF9DE9961",      action:"Returned", by:"Foday", date:"13 Mar", status:"Returned", cond:"Good Condition" },
];

const STAFF      = ["Mr Isaac","Susan","Fred","Foday","OJOE","Emmanuel"];
const CATS       = ["Installation","Replacement","Connectors","General"];
const CONDITIONS = ["Good Condition","Faulty","Damaged","New in Box","New in Pack"];

const statusColor = {
  "In Stock":"#4CD964","In Field":"#FF9F0A","Low Stock":"#FF9F0A",
  "Out of Stock":"#FF3B30","Returned":"#5AC8FA","Received":"#4CD964",
  "Faulty":"#FF3B30","Active":"#FF9F0A",
};

function Dot({ status }) {
  return (
    <span style={{
      width:7,height:7,borderRadius:"50%",
      background:statusColor[status]||"#888",
      display:"inline-block",marginRight:5,flexShrink:0
    }}/>
  );
}

function Av({ name, sz=40, bg=A, tc="#000" }) {
  const ini = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{
      width:sz,height:sz,borderRadius:"50%",background:bg,color:tc,
      display:"flex",alignItems:"center",justifyContent:"center",
      fontWeight:700,fontSize:sz*0.34,flexShrink:0
    }}>{ini}</div>
  );
}

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"7px 15px",borderRadius:999,border:"none",cursor:"pointer",
      background: active ? A : DC2,
      color: active ? "#000" : MU,
      fontWeight: active ? 700 : 400, fontSize:13,
      whiteSpace:"nowrap"
    }}>{label}</button>
  );
}

function NavBtn({ icon, label, active, onClick, light }) {
  return (
    <button onClick={onClick} style={{
      flex:1,background:"none",border:"none",cursor:"pointer",
      display:"flex",flexDirection:"column",alignItems:"center",gap:3,
      padding:"8px 0",color: active ? A : (light ? "#AAAAAA" : MU)
    }}>
      <span style={{ fontSize:20 }}>{icon}</span>
      <span style={{ fontSize:10,fontWeight: active ? 700 : 400 }}>{label}</span>
    </button>
  );
}

function QRGrid() {
  const p=[
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,1,0,1,1,0,1,1],
    [0,1,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,0,1,0,0],
    [1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0],
    [0,1,0,1,1,0,0,0,1,0,0,1,0,1,0,0,1,0,1,0,1],
    [1,0,0,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,1,0,0,1,1],
    [1,0,1,1,0,1,1,1,0,1,0,0,1,0,1,0,1,1,1,0,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,1,0,1,1,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,0,1,0,1,1,0,0],
    [1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,0,1,0,0,1,1],
  ];
  const s=7;
  return (
    <svg width={p[0].length*s} height={p.length*s} style={{display:"block"}}>
      <rect width="100%" height="100%" fill="white"/>
      {p.map((row,ri)=>row.map((cell,ci)=>
        cell?<rect key={`${ri}-${ci}`} x={ci*s} y={ri*s} width={s} height={s} fill="#111"/>:null
      ))}
    </svg>
  );
}

function Lbl({ t }) {
  return <div style={{fontSize:12,color:"#888",marginBottom:5,marginTop:14}}>{t}</div>;
}
function SelF({ val, set, opts }) {
  return (
    <select value={val} onChange={e=>set(e.target.value)} style={{
      width:"100%",padding:"12px 14px",borderRadius:12,
      border:"1.5px solid #E8E8E8",background:"#fff",
      fontSize:14,color:"#111",WebkitAppearance:"none"
    }}>
      {opts.map(o=><option key={o}>{o}</option>)}
    </select>
  );
}

export default function App() {
  const [screen,  setScreen]  = useState("dash");
  const [navTab,  setNavTab]  = useState("home");
  const [filter,  setFilter]  = useState("All");
  const [selProd, setSelProd] = useState(null);
  const [toast,   setToast]   = useState("");

  const isLight = ["detail","issue","return"].includes(screen);
  const bg = isLight ? "#F4F4F4" : DB;

  const fire = (msg) => { setToast(msg); setTimeout(()=>setToast(""),2600); };

  const goTo = (tab) => {
    setNavTab(tab);
    if(tab==="home") setScreen("dash");
    else if(tab==="scan"){ setSelProd(PRODUCTS[0]); setScreen("detail"); }
    else if(tab==="products") setScreen("products");
  };

  const DashScreen = () => {
    const inS=PRODUCTS.filter(p=>p.status==="In Stock").length;
    const lowS=PRODUCTS.filter(p=>p.status==="Low Stock").length;
    const outS=PRODUCTS.filter(p=>p.status==="Out of Stock").length;
    return (
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 20px 0",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Av name="Mr Isaac" sz={40}/>
              <div>
                <div style={{fontSize:11,color:MU}}>Store Manager</div>
                <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>Mr Isaac</div>
              </div>
            </div>
            <button style={{width:36,height:36,borderRadius:"50%",background:A,border:"none",
              cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",
              justifyContent:"center",color:"#000",fontWeight:700,lineHeight:1}}>+</button>
          </div>

          <div style={{
            borderRadius:22,padding:"20px",marginBottom:14,overflow:"hidden",
            background:`repeating-linear-gradient(135deg,#1C1C1C 0px,#1C1C1C 14px,#212121 14px,#212121 28px)`,
            border:`1px solid ${BR}`
          }}>
            <div style={{fontSize:11,color:MU,marginBottom:6,letterSpacing:1,textTransform:"uppercase"}}>Stock Overview</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:18}}>
              <div>
                <div style={{fontSize:11,color:MU}}>Total Products</div>
                <div style={{fontSize:38,fontWeight:800,color:"#fff",lineHeight:1}}>{PRODUCTS.length}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:MU}}>In Stock</div>
                <div style={{fontSize:38,fontWeight:800,color:A,lineHeight:1}}>{inS}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              {[
                {label:"Low",   count:lowS, clr:"#FF9F0A", bg:"rgba(255,159,10,0.15)"},
                {label:"Empty", count:outS, clr:"#FF3B30", bg:"rgba(255,59,48,0.14)"},
                {label:"Items", count:PRODUCTS.reduce((a,p)=>a+p.stock,0), clr:A, bg:"rgba(170,239,53,0.12)"},
              ].map(s=>(
                <div key={s.label} style={{flex:1,background:s.bg,borderRadius:12,padding:"8px 10px"}}>
                  <div style={{fontSize:10,color:s.clr,fontWeight:600}}>{s.label}</div>
                  <div style={{fontSize:20,fontWeight:800,color:s.clr}}>{s.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"flex",gap:8,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
            {["All","In Field","Returned","Received"].map(f=>(
              <Pill key={f} label={f} active={filter===f} onClick={()=>setFilter(f)}/>
            ))}
          </div>
        </div>

        <div style={{padding:"0 20px 16px",flex:1}}>
          <div style={{fontSize:11,color:MU,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Recent Activity</div>
          {TX.map((tx,i)=>(
            <div key={i} onClick={()=>{setSelProd(PRODUCTS.find(p=>p.name===tx.product)||PRODUCTS[0]);setScreen("detail");}}
              style={{background:DC,borderRadius:16,padding:"12px 14px",marginBottom:8,
                display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:`1px solid ${BR}`}}>
              <Av name={tx.product} sz={44} bg={DC2} tc={A}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:600,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tx.product}</div>
                <div style={{fontSize:11,color:MU}}>{tx.serial?tx.serial.slice(0,16):`×${tx.qty} units`} · {tx.date}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:2}}>{tx.action}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                  <Dot status={tx.status}/><span style={{fontSize:11,color:MU}}>{tx.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProductsScreen = () => (
    <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 20px 0",flexShrink:0}}>
        <div style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:12}}>Products</div>
        <div style={{background:DC,borderRadius:12,padding:"0 12px",marginBottom:14,
          display:"flex",alignItems:"center",border:`1px solid ${BR}`}}>
          <span style={{color:MU,fontSize:16}}>⌕</span>
          <input placeholder="Search products…" style={{
            background:"none",border:"none",outline:"none",
            color:"#fff",padding:"11px 8px",flex:1,fontSize:14
          }}/>
        </div>
      </div>
      <div style={{padding:"0 20px 16px",flex:1}}>
        {PRODUCTS.map((p,i)=>{
          const tc=p.status==="Out of Stock"?"#FF3B30":p.status==="Low Stock"?"#FF9F0A":A;
          const ab=p.status==="Out of Stock"?"#2A1212":p.status==="Low Stock"?"#2A2010":DC2;
          return (
            <div key={i} onClick={()=>{setSelProd(p);setScreen("detail");}}
              style={{background:DC,borderRadius:16,padding:"12px 14px",marginBottom:8,
                display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:`1px solid ${BR}`}}>
              <Av name={p.name} sz={44} bg={ab} tc={tc}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:600,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                <div style={{fontSize:11,color:MU}}>{p.cat} · {p.serials.length||"No"} serial{p.serials.length!==1?"s":""}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>{p.stock}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                  <Dot status={p.status}/><span style={{fontSize:10,color:MU}}>{p.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const DetailScreen = () => {
    if(!selProd) return null;
    const serial=selProd.serials[0]||"N/A";
    return (
      <div style={{flex:1,overflowY:"auto",background:"#F4F4F4",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"12px 20px",display:"flex",alignItems:"center",background:"#F4F4F4",flexShrink:0}}>
          <button onClick={()=>setScreen(navTab==="products"?"products":"dash")}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:24,color:"#111",padding:4,lineHeight:1}}>‹</button>
          <div style={{flex:1,textAlign:"center",fontSize:16,fontWeight:700,color:"#111"}}>Details</div>
          <div style={{width:28}}/>
        </div>
        <div style={{padding:"0 20px 20px",flex:1}}>
          <div style={{background:"#fff",borderRadius:18,padding:"16px",marginBottom:12,border:"1px solid #EBEBEB"}}>
            <div style={{fontSize:20,fontWeight:800,color:"#111",marginBottom:12}}>{selProd.name}</div>
            <div style={{display:"flex",gap:12,marginBottom:4}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:"#888",marginBottom:2}}>Serial Number</div>
                <div style={{fontSize:12,fontWeight:600,color:"#111",wordBreak:"break-all"}}>{serial}</div>
              </div>
              <div>
                <div style={{fontSize:11,color:"#888",marginBottom:2}}>Category</div>
                <div style={{fontSize:12,fontWeight:600,color:"#111"}}>{selProd.cat}</div>
              </div>
              <div>
                <div style={{fontSize:11,color:"#888",marginBottom:2}}>Status</div>
                <div style={{display:"flex",alignItems:"center"}}>
                  <Dot status={selProd.status}/>
                  <span style={{fontSize:12,fontWeight:600,color:"#111"}}>{selProd.status}</span>
                </div>
              </div>
            </div>
            <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #F0F0F0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:"#888"}}>Outstanding Balance</span>
              <span style={{fontSize:18,fontWeight:800,color:"#111"}}>{selProd.stock} pcs</span>
            </div>
          </div>

          <button onClick={()=>setScreen("issue")} style={{
            width:"100%",padding:"16px",borderRadius:16,border:"none",
            background:A,color:"#000",fontWeight:800,fontSize:16,cursor:"pointer",marginBottom:10
          }}>Issue Item</button>

          <div style={{display:"flex",gap:10,marginBottom:14}}>
            <button onClick={()=>setScreen("return")} style={{
              flex:1,padding:"14px",borderRadius:16,background:"none",
              border:"1.5px solid #DEDEDE",color:"#111",fontWeight:600,fontSize:14,cursor:"pointer"
            }}>↩ Return</button>
            <button onClick={()=>fire("⚠️ Faulty flag noted — update Sheets")} style={{
              flex:1,padding:"14px",borderRadius:16,background:"none",
              border:"1.5px solid #DEDEDE",color:"#111",fontWeight:600,fontSize:14,cursor:"pointer"
            }}>⚠ Mark Faulty</button>
          </div>

          <div style={{background:"#fff",borderRadius:18,padding:"18px 16px 14px",border:"1px solid #EBEBEB",textAlign:"center"}}>
            <div style={{fontSize:12,color:"#888",marginBottom:12}}>↓ Download QR Code</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
              <div style={{borderRadius:10,overflow:"hidden",border:"1px solid #F0F0F0"}}><QRGrid/></div>
            </div>
            <div style={{fontSize:11,color:"#999",fontFamily:"monospace"}}>{serial}</div>
          </div>
        </div>
      </div>
    );
  };

  const IssueScreen = () => {
    const [cat,  setCat]  = useState("Installation");
    const [to,   setTo]   = useState("Fred");
    const [auth, setAuth] = useState("Mr Isaac");
    const [cust, setCust] = useState("");
    const [qty,  setQty]  = useState(1);
    return (
      <div style={{flex:1,overflowY:"auto",background:"#F4F4F4",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"12px 20px",display:"flex",alignItems:"center",background:"#F4F4F4",flexShrink:0}}>
          <button onClick={()=>setScreen("detail")} style={{background:"none",border:"none",cursor:"pointer",fontSize:24,color:"#111",padding:4,lineHeight:1}}>‹</button>
          <div style={{flex:1,textAlign:"center",fontSize:16,fontWeight:700,color:"#111"}}>Issue Item</div>
          <div style={{width:28}}/>
        </div>
        <div style={{margin:"0 20px 2px",background:"#fff",borderRadius:14,padding:"12px 14px",
          border:"1px solid #EBEBEB",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <Av name={selProd?.name||"?"} sz={40} bg={A} tc="#000"/>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#111"}}>{selProd?.name}</div>
            <div style={{fontSize:11,color:"#888"}}>{selProd?.serials?.[0]||"No serial"}</div>
          </div>
        </div>
        <div style={{padding:"0 20px",flex:1}}>
          <Lbl t="Category *"/><SelF val={cat} set={setCat} opts={CATS}/>
          <Lbl t="Quantity *"/>
          <div style={{display:"flex",gap:10,alignItems:"center",marginTop:4}}>
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:44,height:44,borderRadius:12,border:"1.5px solid #E8E8E8",background:"#fff",fontSize:22,cursor:"pointer",color:"#111",fontWeight:700}}>−</button>
            <div style={{flex:1,textAlign:"center",fontSize:26,fontWeight:800,color:"#111"}}>{qty}</div>
            <button onClick={()=>setQty(q=>q+1)} style={{width:44,height:44,borderRadius:12,border:"none",background:A,fontSize:22,cursor:"pointer",color:"#000",fontWeight:700}}>+</button>
          </div>
          <Lbl t="Issued To *"/><SelF val={to} set={setTo} opts={STAFF}/>
          <Lbl t="Authorized By *"/><SelF val={auth} set={setAuth} opts={STAFF}/>
          <Lbl t="Customer Name (optional)"/>
          <input value={cust} onChange={e=>setCust(e.target.value)} placeholder="e.g. John Doe"
            style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid #E8E8E8",
              background:"#fff",fontSize:14,color:"#111",boxSizing:"border-box"}}/>
          <button onClick={()=>{fire("✅ Item issued — Sheets updated!");setScreen("dash");setNavTab("home");}}
            style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:A,
              color:"#000",fontWeight:800,fontSize:16,cursor:"pointer",marginTop:20,marginBottom:16}}>
            Submit → Log to Sheets
          </button>
        </div>
      </div>
    );
  };

  const ReturnScreen = () => {
    const [retBy,setRetBy]=useState("Fred");
    const [recBy,setRecBy]=useState("Mr Isaac");
    const [cond, setCond] =useState("Good Condition");
    const isBad=["Faulty","Damaged"].includes(cond);
    return (
      <div style={{flex:1,overflowY:"auto",background:"#F4F4F4",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"12px 20px",display:"flex",alignItems:"center",background:"#F4F4F4",flexShrink:0}}>
          <button onClick={()=>setScreen("detail")} style={{background:"none",border:"none",cursor:"pointer",fontSize:24,color:"#111",padding:4,lineHeight:1}}>‹</button>
          <div style={{flex:1,textAlign:"center",fontSize:16,fontWeight:700,color:"#111"}}>Return Item</div>
          <div style={{width:28}}/>
        </div>
        <div style={{margin:"0 20px 2px",background:"#fff",borderRadius:14,padding:"12px 14px",
          border:"1px solid #EBEBEB",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <Av name={selProd?.name||"?"} sz={40} bg={A} tc="#000"/>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#111"}}>{selProd?.name}</div>
            <div style={{fontSize:11,color:"#888"}}>{selProd?.serials?.[0]||"No serial"}</div>
          </div>
        </div>
        <div style={{padding:"0 20px",flex:1}}>
          <Lbl t="Returned By *"/><SelF val={retBy} set={setRetBy} opts={STAFF}/>
          <Lbl t="Received By *"/><SelF val={recBy} set={setRecBy} opts={STAFF}/>
          <Lbl t="Condition *"/>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
            {CONDITIONS.map(c=>(
              <button key={c} onClick={()=>setCond(c)} style={{
                padding:"8px 14px",borderRadius:999,fontSize:12,cursor:"pointer",
                border:cond===c?`2px solid ${A}`:"1.5px solid #E0E0E0",
                background:cond===c?`${A}22`:"#fff",
                color:cond===c?"#1A2C00":"#555",fontWeight:cond===c?700:400
              }}>{c}</button>
            ))}
          </div>
          {isBad&&(
            <div style={{background:"#FFF8E1",borderRadius:12,padding:"12px 14px",marginTop:12,border:"1px solid #FFD54F"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#E65100"}}>⚠ Faulty / Damaged</div>
              <div style={{fontSize:12,color:"#BF360C",marginTop:3,lineHeight:1.5}}>Admin will be prompted to update the Faulty Units column in Google Sheets.</div>
            </div>
          )}
          <button onClick={()=>{fire("✅ Return logged — Sheets updated!");setScreen("dash");setNavTab("home");}}
            style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:A,
              color:"#000",fontWeight:800,fontSize:16,cursor:"pointer",marginTop:20,marginBottom:16}}>
            Submit → Log to Sheets
          </button>
        </div>
      </div>
    );
  };

  const showNav=!["issue","return"].includes(screen);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap');
        *{font-family:'DM Sans',-apple-system,sans-serif;box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        input,select,button{font-family:inherit;}
        input::placeholder{color:#9A9A9A;}
        select{-webkit-appearance:none;}
      `}</style>
      <div style={{background:"#C8DEEA",padding:"28px 16px 24px",display:"flex",justifyContent:"center"}}>
        <div style={{
          width:375,borderRadius:46,overflow:"hidden",background:bg,
          boxShadow:"0 0 0 8px #111, 0 0 0 10px #3A3A3A, 0 28px 70px rgba(0,0,0,0.45)",
          display:"flex",flexDirection:"column",height:760,position:"relative"
        }}>
          {/* Status bar */}
          <div style={{
            height:46,display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"0 26px",flexShrink:0,
            background:isLight?"#F4F4F4":"#0A0A0A"
          }}>
            <span style={{fontSize:14,fontWeight:700,color:isLight?"#111":"#fff"}}>9:41</span>
            <div style={{width:110,height:22,borderRadius:12,background:"#0A0A0A",
              border:isLight?"1px solid #DDD":"none",position:"absolute",left:"50%",transform:"translateX(-50%)"}}/>
            <span style={{fontSize:12,color:isLight?"#555":"#888",letterSpacing:2}}>●▲▌</span>
          </div>

          {/* Content */}
          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0}}>
            {screen==="dash"     && <DashScreen/>}
            {screen==="products" && <ProductsScreen/>}
            {screen==="detail"   && <DetailScreen/>}
            {screen==="issue"    && <IssueScreen/>}
            {screen==="return"   && <ReturnScreen/>}
          </div>

          {/* Toast */}
          {toast&&(
            <div style={{
              position:"absolute",bottom:showNav?80:20,left:"50%",transform:"translateX(-50%)",
              background:"#111",color:"#fff",padding:"11px 22px",borderRadius:999,
              fontSize:13,fontWeight:600,zIndex:99,whiteSpace:"nowrap",
              border:`1px solid ${BR}`
            }}>{toast}</div>
          )}

          {/* Bottom nav */}
          {showNav&&(
            <div style={{
              height:68,display:"flex",alignItems:"center",
              background:isLight?"#fff":DC,
              borderTop:`1px solid ${isLight?"#EBEBEB":BR}`,
              flexShrink:0,paddingBottom:4
            }}>
              <NavBtn icon="⌂" label="Home"     active={navTab==="home"}     light={isLight} onClick={()=>goTo("home")}/>
              <NavBtn icon="⬡" label="Scan"     active={navTab==="scan"}     light={isLight} onClick={()=>goTo("scan")}/>
              <NavBtn icon="☰" label="Products" active={navTab==="products"} light={isLight} onClick={()=>goTo("products")}/>
              <NavBtn icon="○" label="Profile"  active={navTab==="profile"}  light={isLight} onClick={()=>goTo("profile")}/>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
