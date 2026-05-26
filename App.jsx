import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ComposedChart, Line, PieChart, Pie } from "recharts";

const MO=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const COLORS=["#1D9E75","#534AB7","#D85A30","#185FA5","#BA7517","#E24B4A","#D4537E","#639922","#888"];
const OPEX_LINES=["SW0001","SM0001","TA0001","PF0001","OF0001"];
const OPEX_LABELS={SW0001:"Salaries & Wages",SM0001:"Sales & Marketing",TA0001:"Travel & Accommodation",PF0001:"Professional Fees",OF0001:"Office Expenses"};

// Molecule mapping to Consolidado names
const MOL_MAP={"Ácido Hialurónico 1%":"Hyaxum","Ácido Hialurónico 1.5%":"Hyaxum","Ácido Hialurónico 2%":"Hyaxum","Bevacizumab 100":"Bevacizumab","Bevacizumab 400":"Bevacizumab","Hyaxum 1":"Hyaxum","Hyaxum 1.5 Plus":"Hyaxum","Hyaxum 2 Pro":"Hyaxum","Euxara":"Euxara","Fixed":"Fixed","ACHI":"Hyaxum","BEVA":"Bevacizumab","TERI":"Euxara","FIXED":"Fixed","PELI":"Peli","DENO":"Deno","SIME":"Sime","ACMI":"Acmi"};
const mapMol=m=>MOL_MAP[m]||m;

// Multi-select dropdown component
function MultiSel({options,selected,onChange,label}){
  const [open,setOpen]=useState(false);
  const allSelected=selected.length===0||selected.length===options.length;
  const displayText=allSelected?label:`${selected.length} seleccionadas`;
  return(
    <div style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpen(!open)} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #D0D5E8",fontSize:11,fontFamily:"inherit",background:"#fff",cursor:"pointer",color:"#1a1a2e",display:"flex",alignItems:"center",gap:4}}>
        {displayText}<span style={{fontSize:8}}>{open?"▲":"▼"}</span>
      </button>
      {open&&<div style={{position:"absolute",top:"100%",left:0,marginTop:4,background:"#fff",border:"1px solid #D0D5E8",borderRadius:8,padding:6,zIndex:100,minWidth:160,maxHeight:200,overflowY:"auto",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>
        <div style={{padding:"4px 8px",fontSize:10,cursor:"pointer",borderRadius:4,background:allSelected?"#D4F0E6":"transparent",marginBottom:2}} onClick={()=>{onChange([]);setOpen(false)}}>✓ Todas</div>
        {options.map(o=>{const isOn=selected.includes(o);return(
          <div key={o} style={{padding:"4px 8px",fontSize:10,cursor:"pointer",borderRadius:4,background:isOn?"#E6F1FB":"transparent",display:"flex",alignItems:"center",gap:4}} onClick={()=>{const next=isOn?selected.filter(x=>x!==o):[...selected,o];onChange(next.length===options.length?[]:next)}}>
            <span style={{width:12,height:12,borderRadius:3,border:"1px solid #D0D5E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,background:isOn?"#185FA5":"#fff",color:"#fff"}}>{isOn?"✓":""}</span>{o}
          </div>
        )})}
      </div>}
    </div>
  );
}

const D=[["COGS","Forecast",1,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",2,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1355200.0],["COGS","Forecast",4,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",5,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",677600.0],["COGS","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["COGS","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0.0],["DP0001","Reales",1,"FIXED","NOAP","—","Ajuste Depreciación","NOAP",513127.62],["EBIT","Forecast",1,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBIT","Forecast",2,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBIT","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",-1410880.0],["EBIT","Forecast",4,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBIT","Forecast",5,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBIT","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",180083.09],["EBIT","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",360166.18],["EBIT","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",539291.39],["EBIT","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",221857.58],["EBIT","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1438748.97],["EBIT","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["EBIT","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["EBITDA","Forecast",1,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBITDA","Forecast",2,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBITDA","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",-1410880.0],["EBITDA","Forecast",4,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBITDA","Forecast",5,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["EBITDA","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",180083.09],["EBITDA","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",360166.18],["EBITDA","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",539291.39],["EBITDA","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",221857.58],["EBITDA","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1438748.97],["EBITDA","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["EBITDA","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["FE0001","Reales",1,"FIXED","NOAP","—","Ajuste Financial Expense","NOAP",435134.95],["FI0001","Reales",1,"FIXED","NOAP","—","Ajuste Financial Income","NOAP",-514523.15],["Gross Profit","Forecast",1,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["Gross Profit","Forecast",2,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["Gross Profit","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",-1355200.0],["Gross Profit","Forecast",4,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["Gross Profit","Forecast",5,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",0],["Gross Profit","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",180083.09],["Gross Profit","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",360166.18],["Gross Profit","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",539291.39],["Gross Profit","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",221857.58],["Gross Profit","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1438748.97],["Gross Profit","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["Gross Profit","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["Gross to Net","Forecast",1,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",2,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",4,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",5,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["Gross to Net","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1280.6],["IT0001","Reales",1,"FIXED","NOAP","Licencias de Software","Notion + AWS","VARIOS",45978.63],["IT0001","Reales",2,"FIXED","NOAP","Licencias de Software","Amazon MXN","AMAZON WEB SERVICES",44.16],["IT0001","Reales",4,"FIXED","NOAP","Licencias de Software","AWS","AMAZON WEB SERVICES",39.17],["IT0001","Reales",5,"FIXED","NOAP","Reclutamiento Fees","LinkedIn","PPROMEX*LINKEDIN",4066.36],["IT0001","Reales",7,"FIXED","NOAP","Licencias de Software","Declaración tributaria","EDICOMUNICACIONES MEXICO",199.0],["IT0001","Reales",9,"FIXED","NOAP","Licencias de Software","Asana (4 meses)","ASANA",15200.0],["Net Sales","Forecast",6,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",180083.09],["Net Sales","Forecast",7,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",360166.19],["Net Sales","Forecast",8,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",539291.39],["Net Sales","Forecast",9,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",899457.58],["Net Sales","Forecast",10,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1438748.98],["Net Sales","Forecast",11,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["Net Sales","Forecast",12,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",1978998.26],["OF0001","Reales",3,"FIXED","NOAP","Arrendamiento","Renta oficina","COWORKING CHAPULTEPEC",49700.0],["OF0001","Reales",5,"FIXED","NOAP","Comidas","Comida equipo","LAGUNEROS ORIENTALES",263.79],["OF0001","Reales",6,"FIXED","NOAP","Arrendamiento","Renta oficinas","COWORKING CHAPULTEPEC",155401.28],["OF0001","Reales",9,"FIXED","NOAP","Papelería","Papelería","OFFICE DEPOT INTERNET",5350.43],["OF0001","Reales",10,"FIXED","NOAP","Papelería","Impresiones","OFFICE DEPOT AMERICAS",34.48],["OF0001","Reales",11,"FIXED","NOAP","Papelería","Farmacopea","FARMACOPEA MX",1920.0],["OF0001","Reales",12,"FIXED","NOAP","Equipo","Servicio Sistemas","T9 DIGITAL",850.0],["OP0001","Reales",1,"FIXED","NOAP","—","Ajuste Operaciones","NOAP",17780.67],["OP0001","Reales",4,"ACHI","SAOS","Logística","Almacenaje y transporte","WORLD COURIER DE MEXICO",15147.16],["OT0001","Reales",1,"FIXED","NOAP","—","Ajuste Others","NOAP",30141.05],["PF0001","Reales",1,"FIXED","NOAP","Reclutamiento Fees","Placement + Recruiter","VARIOS",982129.26],["PF0001","Reales",1,"FIXED","NOAP","Consultoría de marketing","RRPP febrero","INCIDENCIA EN COMUNICACION",95000.0],["PF0001","Reales",1,"FIXED","NOAP","Consultoría estratégica","Consultancy Fee Junee","JUNEE PHARMACEUTICAL",35905.6],["PF0001","Reales",1,"FIXED","NOAP","Consultoría contable","Honorarios abril","PROTEXI EMPRESARIAL",6300.0],["PF0001","Reales",1,"FIXED","NOAP","Traducción","Documentos","DEEPL",195.6],["PF0001","Reales",1,"FIXED","NOAP","—","Ajuste PF","NOAP",-1770.0],["PF0001","Reales",2,"FIXED","NOAP","Consultoría de marketing","RRPP dic-ene","INCIDENCIA EN COMUNICACION",190000.0],["PF0001","Reales",2,"FIXED","NOAP","Consultoría contable","Honorarios marzo","PROTEXI EMPRESARIAL",6300.0],["PF0001","Reales",3,"FIXED","NOAP","Consultoría regulatoria","Farmacovigilancia","JORGE SANCHEZ BADILLO",15750.0],["PF0001","Reales",3,"FIXED","NOAP","Consultoría contable","Honorarios febrero","PROTEXI EMPRESARIAL",6300.0],["PF0001","Reales",3,"TERI","SAOS","Consultoría regulatoria","Permiso Euxara","JORGE SANCHEZ BADILLO",5250.0],["PF0001","Reales",5,"FIXED","NOAP","Consultoría contable","Honorarios enero","PROTEXI EMPRESARIAL",6300.0],["PF0001","Reales",6,"FIXED","NOAP","Consultoría regulatoria","Farmacovigilancia","JORGE SANCHEZ BADILLO",15750.0],["PF0001","Reales",8,"TERI","SAOS","Traducción","Traducción Euxara","PAYCLIP",5420.77],["PF0001","Reales",12,"ACHI","SAOS","Materiales","Material Médico HA","JORGE EDUARDO GARCIA",61269.23],["Quality","Forecast",3,"Ácido Hialurónico 1%","Hyaxum","—","OK","NOAP",55680.0],["SM0001","Reales",1,"ACHI","SAOS","Eventos prelanzamiento","AAOS Conference","VARIOS",40457.78],["SM0001","Reales",2,"ACHI","SAOS","Alimentos","Alimentos AAOS","VARIOS",6603.96],["SM0001","Reales",3,"ACHI","SAOS","Alimentos","Alimentos New Orleans","VARIOS",23915.4],["SM0001","Reales",4,"ACHI","SAOS","Eventos prelanzamiento","AAOS + hospedaje","VARIOS",47790.06],["SM0001","Reales",5,"ACHI","SAOS","Marketing","Apoyo visual + alimentos","VARIOS",67052.04],["SM0001","Reales",6,"ACHI","SAOS","Varios","Alimentos y transporte","VARIOS",5907.58],["SM0001","Reales",7,"ACHI","SAOS","Rep ventas","GDL + BIRMEX","VARIOS",9565.98],["SM0001","Reales",7,"TERI","SAOS","Rep ventas","Dr. Loza","REST HARRYS MASARYK",5829.52],["SM0001","Reales",8,"ACHI","SAOS","Rep ventas","GDL doctores","VARIOS",12377.52],["SM0001","Reales",9,"ACHI","SAOS","Eventos prelanzamiento","Congreso Reumatología","COLEGIO MX REUMATOLOGIA",150000.0],["SM0001","Reales",9,"ACHI","SAOS","Rep ventas","GDL/MTY","VARIOS",4631.5],["SM0001","Reales",10,"ACHI","SAOS","Rep ventas","Pixel Lab","ABARROTS CASROL MIDTWN",851.15],["SM0001","Reales",12,"TERI","SAOS","Rep ventas","CDMX","REST DANTE",3611.06],["SW0001","Reales",1,"FIXED","NOAP","Autos","Tesla Model 3","TRACSA",21339.11],["SW0001","Reales",10,"FIXED","NOAP","Autos","Arrendamiento 4 vehículos","TRACSA",111073.21],["SW0001","Reales",11,"FIXED","NOAP","Capacitación","Curso IA Regulación","AMPRESIH",9655.17],["SW0001","Reales",11,"FIXED","NOAP","Autos","Vehículo refacturación","TRACSA",20818.48],["SW0001","Reales",12,"FIXED","NOAP","Autos","Arrendamiento 4 vehículos","TRACSA",111073.21],["TA0001","Reales",1,"FIXED","NOAP","Hospedaje","TY New York","CORPORATE TRAVEL",31751.0],["TA0001","Reales",1,"PELI","ONHE","Varios","Chicago BD trip","VARIOS",9351.33],["TA0001","Reales",1,"DENO","SAOS","Hospedaje","AG viaje","CORPORATE TRAVEL",2851.36],["TA0001","Reales",1,"TERI","SAOS","Hospedaje","AG viaje","CORPORATE TRAVEL",2851.37],["TA0001","Reales",1,"ACHI","SAOS","—","Devolución KL","- - -",-602.0],["TA0001","Reales",1,"FIXED","NOAP","—","Ajustes varios","NOAP",242.0],["TA0001","Reales",2,"FIXED","NOAP","Taxis","Uber varios","VARIOS",638.72],["TA0001","Reales",2,"PELI","ONHE","Taxis","Uber MTY","UBER",525.85],["TA0001","Reales",3,"PELI","ONHE","Vuelos","Vuelo Chicago","AEROVIAS DE MEXICO",10639.0],["TA0001","Reales",4,"ACHI","SAOS","Viaje GDL","Hospedaje + vuelos GDL","VARIOS",26450.1],["TA0001","Reales",4,"FIXED","NOAP","Viaje ejecutivo","Vuelos TY/AG + uber","VARIOS",25827.44],["TA0001","Reales",5,"FIXED","NOAP","Varios","Hospedaje + uber + vuelo","VARIOS",3659.66],["TA0001","Reales",5,"ACHI","SAOS","Vuelos","Fees aéreos","CORPORATE TRAVEL",366.9],["TA0001","Reales",5,"BEVA","ONHE","Alimentos","Alimentos RC","TIMHOR",499.0],["TA0001","Reales",6,"ACHI","SAOS","Varios","Alimentos + taxis GDL","VARIOS",3271.1],["TA0001","Reales",6,"FIXED","NOAP","Varios","Uber + rosca","VARIOS",586.85],["TA0001","Reales",6,"DENO","SAOS","Visa","Visa India","indianvisa",1139.65],["TA0001","Reales",6,"TERI","SAOS","Visa","Visa India","indianvisa",1139.84],["TA0001","Reales",7,"ACHI","SAOS","Taxis","Uber GDL","VARIOS",2668.08],["TA0001","Reales",7,"FIXED","NOAP","Taxis","Uber varios","VARIOS",264.26],["TA0001","Reales",8,"ACHI","SAOS","Varios","Alimentos + uber GDL","VARIOS",598.53],["TA0001","Reales",8,"FIXED","NOAP","Taxis","Uber CDMX","UBER",1219.68],["TA0001","Reales",9,"ACHI","SAOS","Varios","Alimentos + uber GDL","VARIOS",1352.5],["TA0001","Reales",9,"FIXED","NOAP","Varios","Alimentos + uber CDMX","VARIOS",1537.08],["TA0001","Reales",10,"ACHI","SAOS","Varios","Alimentos + uber","VARIOS",1960.46],["TA0001","Reales",10,"FIXED","NOAP","Varios","Hospedaje + uber + vuelo + alimentos","VARIOS",9841.56],["TA0001","Reales",10,"DENO","SAOS","Permiso","Permiso UK","UKVI",246.83],["TA0001","Reales",10,"TERI","SAOS","Permiso","Permiso UK","UKVI",246.83],["TA0001","Reales",11,"ACHI","SAOS","Taxis","Uber CDMX","VARIOS",810.89],["TA0001","Reales",11,"FIXED","NOAP","Varios","Viaje Boston/SF + vuelos","VARIOS",8420.8],["TA0001","Reales",12,"FIXED","NOAP","Varios","Viaje Boston/SF/MTY","VARIOS",10856.4],["TX0001","Reales",3,"TERI","SAOS","COFEPRIS","Permiso Euxara","COFEPRIS",7300.0]];

const F=v=>{if(!v||v===0)return"—";const n=v<0,a=Math.abs(v);let s;if(a>=1e6)s=`$${(a/1e6).toFixed(1)}M`;else if(a>=1e3)s=`$${(a/1e3).toFixed(1)}K`;else s=`$${a.toFixed(0)}`;return n?`-${s}`:s};
const P=v=>(!isFinite(v)||isNaN(v)||v===0)?"—":`${(v*100).toFixed(1)}%`;
const gV=(d,pl,or,m)=>d.filter(r=>r[0]===pl&&r[1]===or&&r[2]===m).reduce((s,r)=>s+r[8],0);
const gVms=(d,pl,or,ms)=>ms.reduce((s,m)=>s+gV(d,pl,or,m),0);
const mols=[...new Set(D.map(r=>mapMol(r[3])))].sort();
const areas=[...new Set(D.map(r=>r[4]))].filter(a=>a!=="—").sort();

// Build P&L for a single month given a data source mode: "forecast", "reales", "consolidado"
function buildPL(fd, m, cm, mode) {
  // For PL lines (Net Sales, COGS, etc.) - have Forecast data
  const getPL = (pl) => {
    if (mode === "forecast") return gV(fd, pl, "Forecast", m);
    if (mode === "reales") return m <= cm ? gV(fd, pl, "Reales", m) : 0;
    // consolidado: reales up to cm (fallback to forecast if no reales), forecast after cm
    if (m <= cm) { const re = gV(fd, pl, "Reales", m); return re !== 0 ? re : gV(fd, pl, "Forecast", m); }
    return gV(fd, pl, "Forecast", m);
  };
  // For OpEx lines (codes) - only have Reales data
  const getOpex = (pl) => {
    if (mode === "forecast") return 0; // no forecast for individual opex codes
    return m <= cm ? gV(fd, pl, "Reales", m) : 0; // reales only up to cm
  };

  const ns = getPL("Net Sales");
  const cogs = getPL("COGS");
  const gp = ns - cogs;
  const gmPct = ns ? gp / ns : 0;
  const sw = getOpex("SW0001");
  const sm = getOpex("SM0001");
  const ta = getOpex("TA0001");
  const pf = getOpex("PF0001");
  const of_ = getOpex("OF0001");
  const qual = mode === "reales" ? 0 : gV(fd, "Quality", "Forecast", m); // Quality is forecast only
  const totOpex = sw + sm + ta + pf + of_ + qual;
  const totOpexPct = ns ? totOpex / ns : 0;
  const ebitda = gp - totOpex;
  const ebitdaPct = ns ? ebitda / ns : 0;
  const depr = getOpex("DP0001");
  const ebit = ebitda - depr;

  return { ns, cogs, gp, gmPct, sw, sm, ta, pf, of: of_, qual, totOpex, totOpexPct, ebitda, ebitdaPct, depr, ebit };
}

const PL_KEYS = ["ns","cogs","gp","gmPct","sw","sm","ta","pf","of","qual","totOpex","totOpexPct","ebitda","ebitdaPct","depr","ebit"];
const PL_LABELS = {ns:"Net Sales",cogs:"COGS",gp:"Gross Profit",gmPct:"% Gross Margin",sw:"Salaries & Wages",sm:"Sales & Marketing",ta:"Travel & Accommodation",pf:"Professional Fees",of:"Office Expenses",qual:"Quality",totOpex:"TOTAL OPERATING EXPENSES",totOpexPct:"% Total Operating Expenses",ebitda:"EBITDA",ebitdaPct:"% EBITDA",depr:"Depreciation",ebit:"EBIT"};
const PCT_KEYS = new Set(["gmPct","totOpexPct","ebitdaPct"]);
const BOLD_KEYS = new Set(["ns","gp","totOpex","ebitda","ebit"]);
const OPEX_KEY_SET = new Set(["sw","sm","ta","pf","of","qual"]);

export default function Dashboard() {
  const [cm, setCm] = useState(4);
  const [selMols, setSelMols] = useState([]);
  const [selAreas, setSelAreas] = useState([]);
  const [view, setView] = useState("consolidado");
  const [expP, setExpP] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const fd = useMemo(() => {
    let d = D;
    if (selMols.length > 0) d = d.filter(r => selMols.includes(mapMol(r[3])));
    if (selAreas.length > 0) d = d.filter(r => selAreas.includes(r[4]));
    return d;
  }, [selMols, selAreas]);
  const ytdM = useMemo(() => Array.from({ length: cm }, (_, i) => i + 1), [cm]);
  const allM = Array.from({ length: 12 }, (_, i) => i + 1);

  // P&L table data
  const plData = useMemo(() => {
    const monthly = [];
    for (let m = 1; m <= 12; m++) monthly.push(buildPL(fd, m, cm, view));
    // Totals
    const totals = {};
    PL_KEYS.forEach(k => {
      if (PCT_KEYS.has(k)) {
        // Recalculate percentage from totals
        const numKey = k === "gmPct" ? "gp" : k === "totOpexPct" ? "totOpex" : "ebitda";
        const num = monthly.reduce((s, row) => s + row[numKey], 0);
        const den = monthly.reduce((s, row) => s + row.ns, 0);
        totals[k] = den ? num / den : 0;
      } else {
        totals[k] = monthly.reduce((s, row) => s + row[k], 0);
      }
    });
    return { monthly, totals };
  }, [fd, cm, view]);

  // YTD & CM comparison tables
  const comp = useMemo(() => {
    const ytdFC = {}, ytdRE = {}, cmFC = {}, cmRE = {};
    PL_KEYS.forEach(k => {
      const fcMonthly = allM.map(m => buildPL(fd, m, cm, "forecast"));
      const reMonthly = allM.map(m => buildPL(fd, m, cm, "reales"));
      ytdFC[k] = PCT_KEYS.has(k) ?
        (ytdM.reduce((s, m) => s + fcMonthly[m-1].ns, 0) ? ytdM.reduce((s, m) => s + fcMonthly[m-1][k === "gmPct" ? "gp" : k === "totOpexPct" ? "totOpex" : "ebitda"], 0) / ytdM.reduce((s, m) => s + fcMonthly[m-1].ns, 0) : 0) :
        ytdM.reduce((s, m) => s + fcMonthly[m-1][k], 0);
      ytdRE[k] = PCT_KEYS.has(k) ?
        (ytdM.reduce((s, m) => s + reMonthly[m-1].ns, 0) ? ytdM.reduce((s, m) => s + reMonthly[m-1][k === "gmPct" ? "gp" : k === "totOpexPct" ? "totOpex" : "ebitda"], 0) / ytdM.reduce((s, m) => s + reMonthly[m-1].ns, 0) : 0) :
        ytdM.reduce((s, m) => s + reMonthly[m-1][k], 0);
      cmFC[k] = fcMonthly[cm-1][k];
      cmRE[k] = reMonthly[cm-1][k];
    });
    return PL_KEYS.map(k => ({
      k, label: PL_LABELS[k], isPct: PCT_KEYS.has(k), isBold: BOLD_KEYS.has(k),
      ytdFC: ytdFC[k], ytdRE: ytdRE[k], ytdVar: ytdRE[k] - ytdFC[k], ytdVarPct: ytdFC[k] ? (ytdRE[k] - ytdFC[k]) / Math.abs(ytdFC[k]) : 0,
      cmFC: cmFC[k], cmRE: cmRE[k], cmVar: cmRE[k] - cmFC[k], cmVarPct: cmFC[k] ? (cmRE[k] - cmFC[k]) / Math.abs(cmFC[k]) : 0,
    }));
  }, [fd, cm, ytdM]);

  // KPIs
  const kpis = useMemo(() => {
    const c = buildPL(fd, cm, cm, "consolidado");
    const ytdTotals = {};
    PL_KEYS.forEach(k => { ytdTotals[k] = ytdM.reduce((s, m) => s + buildPL(fd, m, cm, "consolidado")[k], 0); });
    const nsYTD = ytdTotals.ns, nsFY = allM.reduce((s, m) => s + buildPL(fd, m, cm, "consolidado").ns, 0);
    const opexYTD = ytdTotals.totOpex;
    return [
      { l: `SALES ${MO[cm-1]}`, v: F(c.ns), s: `YTD ${F(nsYTD)}`, c: "#1D9E75" },
      { l: "NET SALES FY", v: F(nsFY), s: "Forecast anual", c: "#0B6644" },
      { l: `EBITDA ${MO[cm-1]}`, v: F(c.ebitda), s: `YTD ${F(ytdTotals.ebitda)}`, c: c.ebitda < 0 ? "#E24B4A" : "#1D9E75" },
      { l: "GROSS PROFIT YTD", v: F(ytdTotals.gp), s: nsYTD ? `Margen ${P(ytdTotals.gp / nsYTD)}` : "Pre-revenue", c: "#185FA5" },
      { l: `OPEX ${MO[cm-1]}`, v: F(c.totOpex), s: `YTD ${F(opexYTD)}`, c: "#E24B4A" },
      { l: "BURN RATE YTD", v: F(opexYTD - (nsYTD > 0 ? nsYTD : 0)), s: "OpEx - Revenue", c: "#8B5CF6" },
      { l: "COGS YTD", v: F(ytdTotals.cogs), s: `FY ${F(allM.reduce((s, m) => s + buildPL(fd, m, cm, "consolidado").cogs, 0))}`, c: "#BA7517" },
      { l: `EBIT ${MO[cm-1]}`, v: F(c.ebit), s: `YTD ${F(ytdTotals.ebit)}`, c: c.ebit < 0 ? "#E24B4A" : "#1D9E75" },
    ];
  }, [fd, cm, ytdM]);

  // Charts
  const chartData = useMemo(() => MO.map((m, i) => { const p = buildPL(fd, i+1, cm, "consolidado"); return { name: m, Sales: Math.round(p.ns), EBITDA: Math.round(p.ebitda), OpEx: Math.round(p.totOpex), cur: i+1 <= cm }; }), [fd, cm]);

  // Waterfall
  const wf = useMemo(() => {
    const t = {};PL_KEYS.forEach(k=>{t[k]=ytdM.reduce((s,m)=>s+buildPL(fd,m,cm,"consolidado")[k],0)});
    let run=0;return[{name:"Net Sales",val:t.ns},{name:"COGS",val:-t.cogs},{name:"Gross Profit",val:0,total:t.gp},{name:"OpEx",val:-t.totOpex},{name:"EBITDA",val:0,total:t.ebitda},{name:"Depr",val:-t.depr},{name:"EBIT",val:0,total:t.ebit}].map(it=>{if(it.total!==undefined){run=it.total;return{...it,start:0,end:it.total,isT:true}}const s=run;run+=it.val;return{...it,start:s,end:run}});
  }, [fd, cm, ytdM]);

  // Pies
  const OC_ALL=["SW0001","PF0001","SM0001","TA0001","IT0001","OF0001","OP0001","DP0001","FE0001","FI0001","OT0001","TX0001"];
  const pieYTD = useMemo(() => { const map = {}; fd.filter(r => r[1] === "Reales" && OC_ALL.includes(r[0]) && ytdM.includes(r[2])).forEach(r => { const m = mapMol(r[3]); if (!map[m]) map[m] = 0; map[m] += Math.abs(r[8]) }); return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) })).filter(x => x.value > 0).sort((a, b) => b.value - a.value); }, [fd, ytdM]);
  const pieCM = useMemo(() => { const map = {}; fd.filter(r => r[1] === "Reales" && OC_ALL.includes(r[0]) && r[2] === cm).forEach(r => { const m = mapMol(r[3]); if (!map[m]) map[m] = 0; map[m] += Math.abs(r[8]) }); return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) })).filter(x => x.value > 0).sort((a, b) => b.value - a.value); }, [fd, cm]);

  // Pareto
  const pareto = useMemo(() => { const re = fd.filter(r => r[1] === "Reales" && r[2] === cm); const map = {}; re.forEach(r => { const p = r[7]; if (p === "NOAP" || p === "- - -" || p === "VARIOS") return; if (!map[p]) map[p] = { t: 0, items: {} }; map[p].t += r[8]; const c = r[6]; if (!map[p].items[c]) map[p].items[c] = 0; map[p].items[c] += r[8] }); const arr = Object.entries(map).map(([k, v]) => ({ partner: k, total: v.t, items: v.items })).sort((a, b) => Math.abs(b.total) - Math.abs(a.total)); const grand = arr.reduce((s, x) => s + Math.abs(x.total), 0); let cum = 0; return arr.map(x => { cum += Math.abs(x.total); return { ...x, cumPct: grand ? cum / grand : 0 } }); }, [fd, cm]);

  const toggleP = k => setExpP(p => ({ ...p, [k]: !p[k] }));

  // AI Chat
  const buildContext = () => {
    const t = {};PL_KEYS.forEach(k=>{t[k]=ytdM.reduce((s,m)=>s+buildPL(fd,m,cm,"consolidado")[k],0)});
    const cmPL = buildPL(fd, cm, cm, "consolidado");
    return `Mes corriente: ${MO[cm-1]} 2026. Net Sales mes: ${F(cmPL.ns)}, YTD: ${F(t.ns)}. COGS YTD: ${F(t.cogs)}. Gross Profit YTD: ${F(t.gp)}, Margen: ${P(t.ns?t.gp/t.ns:0)}. OpEx mes: ${F(cmPL.totOpex)}, YTD: ${F(t.totOpex)}. EBITDA mes: ${F(cmPL.ebitda)}, YTD: ${F(t.ebitda)}. EBIT YTD: ${F(t.ebit)}. SW YTD: ${F(t.sw)}, SM YTD: ${F(t.sm)}, TA YTD: ${F(t.ta)}, PF YTD: ${F(t.pf)}, OF YTD: ${F(t.of)}. Depr YTD: ${F(t.depr)}. Top partners mes: ${pareto.slice(0,5).map(p=>`${p.partner}: ${F(p.total)}`).join(', ')}. Moléculas con gasto: ${pieCM.map(p=>`${p.name}: ${F(p.value)}`).join(', ')}.`;
  };
  const sendChat = async () => {
    if (!chatMsg.trim() || chatLoading) return;
    const userMsg = chatMsg.trim();
    setChatMsg("");
    setChatHistory(h => [...h, { role: "user", text: userMsg }]);
    setChatLoading(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: userMsg, context: buildContext() }) });
      const data = await r.json();
      setChatHistory(h => [...h, { role: "ai", text: data.response || data.error || "Error" }]);
    } catch (e) { setChatHistory(h => [...h, { role: "ai", text: "Error de conexión. Verifica que ANTHROPIC_API_KEY esté configurada en Vercel." }]); }
    setChatLoading(false);
  };
  const maxP = pareto.length ? Math.abs(pareto[0].total) : 1;
  const sel = { padding: "5px 10px", borderRadius: 6, border: "1px solid #D0D5E8", fontSize: 11, fontFamily: "inherit", background: "#fff", cursor: "pointer", color: "#1a1a2e" };
  const th = { fontSize: 9, color: "#8A90A8", fontWeight: 400, padding: "5px 6px", borderBottom: "1px solid #E4E8F2", whiteSpace: "nowrap" };
  const td = { fontSize: 10, padding: "5px 6px", borderBottom: "1px solid #f0f2fa" };
  const vc = v => v < 0 ? "#E24B4A" : v > 0 ? "#1D9E75" : "#ccc";
  const fv = (v, isPct) => isPct ? P(v) : F(v);
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => { if (percent < 0.05) return null; const r = innerRadius + (outerRadius - innerRadius) * 0.5; const x = cx + r * Math.cos(-midAngle * Math.PI / 180); const y = cy + r * Math.sin(-midAngle * Math.PI / 180); return <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={500}>{`${(percent * 100).toFixed(0)}%`}</text> };

  return (
    <div style={{ fontFamily: "'DM Mono','Consolas',monospace", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #E4E8F2", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="data:image/png;base64,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" alt="Saya Biologics" style={{width:42,height:42,borderRadius:10,objectFit:"cover"}} />
          <div><div style={{ fontFamily: "serif", fontSize: 20, fontWeight: 500, color: "#1a1a2e" }}>Bussines Intelligence</div><div style={{ fontSize: 9, color: "#8A90A8", letterSpacing: 2, textTransform: "uppercase" }}>Rolling Forecast 2026 · Corte: {MO[cm - 1]}</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <select value={cm} onChange={e => setCm(+e.target.value)} style={sel}>{MO.map((m, i) => <option key={i} value={i + 1}>{m} 2026</option>)}</select>
          <MultiSel options={mols} selected={selMols} onChange={setSelMols} label="Todas moléculas"/>
          <MultiSel options={areas} selected={selAreas} onChange={setSelAreas} label="Todas áreas"/>
          <div style={{ display: "flex", borderRadius: 6, border: "1px solid #D0D5E8", overflow: "hidden" }}>
            {[["forecast", "Forecast"], ["reales", "Reales"], ["consolidado", "Consolidado"]].map(([v, l]) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "5px 10px", fontSize: 10, fontFamily: "inherit", border: "none", cursor: "pointer", background: view === v ? "#1a1a2e" : "#fff", color: view === v ? "#fff" : "#1a1a2e", fontWeight: view === v ? 500 : 400 }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* LEGEND */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 8, padding: "3px 8px", borderRadius: 4, background: "#D4F0E6", color: "#085041" }}>● Reales ≤ {MO[cm - 1]}</span>
        <span style={{ fontSize: 8, padding: "3px 8px", borderRadius: 4, background: "#E6F1FB", color: "#185FA5" }}>● Forecast &gt; {MO[cm - 1]}</span>
        <span style={{ fontSize: 8, padding: "3px 8px", borderRadius: 4, background: view === "consolidado" ? "#D4F0E6" : view === "forecast" ? "#E6F1FB" : "#FCEBEB", color: view === "consolidado" ? "#085041" : view === "forecast" ? "#185FA5" : "#E24B4A" }}>Vista: {view.charAt(0).toUpperCase() + view.slice(1)}</span>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(135px,1fr))", gap: 8, marginBottom: 16 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: "10px 12px", borderTop: `3px solid ${k.c}` }}>
            <div style={{ fontSize: 7, color: "#8A90A8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>{k.l}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: k.v.startsWith("-") ? "#E24B4A" : "#1a1a2e", fontFamily: "serif" }}>{k.v}</div>
            <div style={{ fontSize: 8, color: "#8A90A8", marginTop: 2 }}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* P&L TABLE */}
      <div style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: 12, marginBottom: 16, overflowX: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#1a1a2e" }}>P&L Anual — {view === "forecast" ? "Forecast" : view === "reales" ? "Reales" : "Consolidado"} 2026</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>
            <th style={{ ...th, textAlign: "left", position: "sticky", left: 0, background: "#fff", minWidth: 180 }}>Línea P&L</th>
            {MO.map((m, i) => <th key={i} style={{ ...th, textAlign: "right", minWidth: 64, color: i + 1 <= cm ? "#085041" : "#185FA5", background: i + 1 <= cm ? "#f0faf6" : "#f5f8fc" }}>{m}</th>)}
            <th style={{ ...th, textAlign: "right", fontWeight: 500, color: "#1a1a2e", borderLeft: "2px solid #E4E8F2" }}>Total</th>
          </tr></thead>
          <tbody>
            {PL_KEYS.map((k, idx) => {
              const isPct = PCT_KEYS.has(k);
              const isBold = BOLD_KEYS.has(k);
              const isOpex = OPEX_KEY_SET.has(k);
              const isSep = k === "sw";
              const rows = [];
              if (isSep) rows.push(<tr key={"sep-"+idx}><td colSpan={14} style={{ padding: "6px 6px 2px", fontSize: 9, color: "#8A90A8", letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #E4E8F2", fontWeight: 500 }}>Operating Expenses</td></tr>);
              rows.push(
                <tr key={"pl-"+idx} style={{ background: isBold ? "#fafbfe" : "transparent" }}>
                  <td style={{ ...td, fontWeight: isBold ? 500 : 400, color: isOpex ? "#534AB7" : "#1a1a2e", position: "sticky", left: 0, background: isBold ? "#fafbfe" : "#fff", fontSize: isOpex ? 9 : 10, paddingLeft: isOpex ? 16 : 6 }}>{PL_LABELS[k]}</td>
                  {plData.monthly.map((row, mi) => <td key={mi} style={{ ...td, textAlign: "right", color: isPct ? "#8A90A8" : row[k] < 0 ? "#E24B4A" : row[k] === 0 ? "#ccc" : "#1a1a2e", fontWeight: isBold ? 500 : 400, fontSize: isOpex || isPct ? 9 : 10, fontStyle: isPct ? "italic" : "normal" }}>{fv(row[k], isPct)}</td>)}
                  <td style={{ ...td, textAlign: "right", fontWeight: 500, color: isPct ? "#8A90A8" : plData.totals[k] < 0 ? "#E24B4A" : "#1a1a2e", borderLeft: "2px solid #E4E8F2", fontStyle: isPct ? "italic" : "normal" }}>{fv(plData.totals[k], isPct)}</td>
                </tr>
              );
              return rows;
            })}
            })}
          </tbody>
        </table>
      </div>

      {/* YTD + CM TABLES */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[{ t: `YTD ${MO[0]}–${MO[cm - 1]} 2026`, fk: "ytdFC", rk: "ytdRE", vk: "ytdVar", pk: "ytdVarPct" }, { t: `Mes — ${MO[cm - 1]} 2026`, fk: "cmFC", rk: "cmRE", vk: "cmVar", pk: "cmVarPct" }].map((t, ti) => (
          <div key={ti} style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: 12, overflowX: "auto" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#1a1a2e", marginBottom: 8 }}>{t.t}</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Línea", "Forecast", "Reales", "Var $", "Var %"].map(h => <th key={h} style={{ ...th, textAlign: h === "Línea" ? "left" : "right" }}>{h}</th>)}</tr></thead>
              <tbody>{comp.map((r, i) => (
                <tr key={i} style={{ background: r.isBold ? "#fafbfe" : "transparent" }}>
                  <td style={{ ...td, fontWeight: r.isBold ? 500 : 400, fontSize: r.isPct ? 9 : 10, fontStyle: r.isPct ? "italic" : "normal", color: OPEX_KEY_SET.has(r.k) ? "#534AB7" : "#1a1a2e", paddingLeft: OPEX_KEY_SET.has(r.k) ? 16 : 6 }}>{r.label}</td>
                  <td style={{ ...td, textAlign: "right", color: r[t.fk] < 0 ? "#E24B4A" : "#185FA5", fontSize: r.isPct ? 9 : 10 }}>{fv(r[t.fk], r.isPct)}</td>
                  <td style={{ ...td, textAlign: "right", color: vc(r[t.rk]), fontSize: r.isPct ? 9 : 10 }}>{fv(r[t.rk], r.isPct)}</td>
                  <td style={{ ...td, textAlign: "right", color: vc(r[t.vk]), fontWeight: 500, fontSize: r.isPct ? 9 : 10 }}>{r.isPct ? P(r[t.vk]) : F(r[t.vk])}</td>
                  <td style={{ ...td, textAlign: "right" }}>{!r.isPct && <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 500, background: r[t.pk] < 0 ? "#FCEBEB" : r[t.pk] > 0 ? "#D4F0E6" : "#f0f2fa", color: vc(r[t.pk]) }}>{P(r[t.pk])}</span>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#1a1a2e", marginBottom: 8 }}>Revenue vs OpEx Mensual</div>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: "#8A90A8" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 7, fill: "#8A90A8" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : "0"} />
              <Tooltip formatter={v => `$${(v / 1e3).toFixed(1)}K`} contentStyle={{ fontSize: 9, borderRadius: 6 }} /><ReferenceLine y={0} stroke="#E4E8F2" />
              <Bar dataKey="Sales" radius={[3, 3, 0, 0]}>{chartData.map((e, i) => <Cell key={i} fill={e.cur ? "#1D9E7566" : "#1D9E7533"} />)}</Bar>
              <Bar dataKey="OpEx" radius={[3, 3, 0, 0]}>{chartData.map((e, i) => <Cell key={i} fill={e.cur ? "#E24B4A55" : "#E24B4A22"} />)}</Bar>
              <Line type="monotone" dataKey="EBITDA" stroke="#534AB7" strokeWidth={2} dot={{ r: 2, fill: "#534AB7" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#1a1a2e", marginBottom: 8 }}>Cascada P&L — YTD</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={wf} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <XAxis dataKey="name" tick={{ fontSize: 7, fill: "#8A90A8" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 7, fill: "#8A90A8" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v <= -1e6 ? `-${(Math.abs(v) / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : "0"} />
              <Tooltip formatter={v => `$${(v / 1e3).toFixed(1)}K`} contentStyle={{ fontSize: 9, borderRadius: 6 }} /><ReferenceLine y={0} stroke="#E4E8F2" />
              <Bar dataKey="start" stackId="a" fill="transparent" /><Bar dataKey="end" stackId="a" radius={[3, 3, 0, 0]}>{wf.map((e, i) => <Cell key={i} fill={e.isT ? (e.total >= 0 ? "#1D9E75" : "#E24B4A") : (e.val >= 0 ? "#1D9E7577" : "#E24B4A77")} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHARTS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[{ title: "Gasto Real por Molécula — YTD", sub: `${MO[0]}–${MO[cm - 1]}`, data: pieYTD }, { title: `Gasto Real por Molécula — ${MO[cm - 1]}`, sub: "Mes corriente", data: pieCM }].map((p, pi) => (
          <div key={pi} style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#1a1a2e", marginBottom: 4 }}>{p.title}</div>
            {p.data.length === 0 ? <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#8A90A8", fontSize: 10 }}>Sin gastos</div> :
              <div style={{ display: "flex", alignItems: "center" }}>
                <ResponsiveContainer width="60%" height={180}><PieChart><Pie data={p.data} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderLabel} labelLine={false}>{p.data.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={v => F(v)} contentStyle={{ fontSize: 9, borderRadius: 6 }} /></PieChart></ResponsiveContainer>
                <div style={{ width: "40%", fontSize: 9 }}>{p.data.map((e, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</span><span style={{ marginLeft: "auto", color: "#8A90A8", flexShrink: 0 }}>{F(e.value)}</span></div>)}</div>
              </div>}
          </div>
        ))}
      </div>

      {/* PARETO */}
      <div style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#1a1a2e", marginBottom: 10 }}>Pareto por Partner — {MO[cm - 1]} 2026</div>
        {pareto.length === 0 && <div style={{ fontSize: 10, color: "#8A90A8", padding: 16, textAlign: "center" }}>Sin gastos con partner en {MO[cm - 1]}</div>}
        {pareto.slice(0, 15).map((p, i) => { const w = maxP ? Math.abs(p.total) / maxP * 100 : 0; const isE = expP[p.partner]; return (
          <div key={i} style={{ marginBottom: isE ? 8 : 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => toggleP(p.partner)}>
              <div style={{ width: 150, fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }} title={p.partner}><span style={{ fontSize: 7, marginRight: 3 }}>{isE ? "▼" : "▶"}</span>{p.partner.length > 20 ? p.partner.slice(0, 20) + "…" : p.partner}</div>
              <div style={{ flex: 1, height: 16, background: "#f0f2fa", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${w}%`, background: p.total < 0 ? "#FCEBEB" : "linear-gradient(90deg,#1D9E7544,#1D9E7522)", borderRadius: 3, border: `1px solid ${p.total < 0 ? "#E24B4A44" : "#1D9E7544"}` }} /></div>
              <div style={{ width: 65, textAlign: "right", fontSize: 9, fontWeight: 500, color: p.total < 0 ? "#E24B4A" : "#1a1a2e", flexShrink: 0 }}>{F(p.total)}</div>
              <div style={{ width: 36, textAlign: "right", fontSize: 8, color: "#8A90A8", flexShrink: 0 }}>{P(p.cumPct)}</div>
            </div>
            {isE && <div style={{ marginLeft: 18, marginTop: 3, borderLeft: "2px solid #E4E8F2", paddingLeft: 8 }}>{Object.entries(p.items).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).map(([co, val], j) => (
              <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: 8, color: "#666" }}><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>{co}</span><span style={{ fontWeight: 500, color: val < 0 ? "#E24B4A" : "#1a1a2e", flexShrink: 0, marginLeft: 8 }}>{F(val)}</span></div>
            ))}</div>}
          </div>
        ); })}
      </div>

      {/* AI AGENT */}
      <div style={{position:"fixed",bottom:20,right:20,zIndex:1000}}>
        {chatOpen && <div style={{width:380,height:460,background:"#fff",border:"1px solid #E4E8F2",borderRadius:14,boxShadow:"0 8px 30px rgba(0,0,0,0.12)",display:"flex",flexDirection:"column",overflow:"hidden",marginBottom:8}}>
          <div style={{padding:"12px 16px",background:"linear-gradient(135deg,#1D9E75,#085041)",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:12,fontWeight:500}}>🤖 Agente Financiero</div><div style={{fontSize:9,opacity:0.8}}>Pregunta sobre tus gastos y forecast</div></div>
            <button onClick={()=>setChatOpen(false)} style={{background:"none",border:"none",color:"#fff",fontSize:18,cursor:"pointer"}}>×</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
            {chatHistory.length===0 && <div style={{textAlign:"center",color:"#8A90A8",fontSize:10,padding:20}}>Hola! Soy tu asistente financiero. Puedes preguntarme cosas como:<br/><br/>• ¿Cuál es el gasto más grande este mes?<br/>• ¿Cómo va nuestro burn rate?<br/>• ¿Qué categoría de OpEx creció más?<br/>• Análisis del P&L YTD</div>}
            {chatHistory.map((m,i) => <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"85%",padding:"8px 12px",borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",background:m.role==="user"?"#1D9E75":"#f0f2fa",color:m.role==="user"?"#fff":"#1a1a2e",fontSize:11,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{m.text}</div>)}
            {chatLoading && <div style={{alignSelf:"flex-start",padding:"8px 12px",borderRadius:12,background:"#f0f2fa",fontSize:11,color:"#8A90A8"}}>Analizando datos...</div>}
          </div>
          <div style={{padding:8,borderTop:"1px solid #E4E8F2",display:"flex",gap:6}}>
            <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Pregunta sobre tus finanzas..." style={{flex:1,padding:"8px 12px",borderRadius:8,border:"1px solid #D0D5E8",fontSize:11,fontFamily:"inherit",outline:"none"}}/>
            <button onClick={sendChat} disabled={chatLoading} style={{padding:"8px 14px",borderRadius:8,border:"none",background:"#1D9E75",color:"#fff",fontSize:11,cursor:"pointer",fontFamily:"inherit",opacity:chatLoading?0.5:1}}>Enviar</button>
          </div>
        </div>}
        <button onClick={()=>setChatOpen(!chatOpen)} style={{width:52,height:52,borderRadius:"50%",border:"none",background:"linear-gradient(135deg,#1D9E75,#085041)",color:"#fff",fontSize:22,cursor:"pointer",boxShadow:"0 4px 14px rgba(29,158,117,0.4)",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"auto"}}>{chatOpen?"×":"🤖"}</button>
      </div>

      <div style={{ textAlign: "center", fontSize: 8, color: "#B0B6CC", padding: "12px 0", marginTop: 8 }}>Saya Biologics — Financial Intelligence · Rolling Forecast 2026</div>
    </div>
  );
}


