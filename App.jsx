import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ComposedChart, Line, PieChart, Pie } from "recharts";

const MO=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const COLORS=["#1D9E75","#534AB7","#D85A30","#185FA5","#BA7517","#E24B4A","#D4537E","#639922","#888"];
const OPEX_LINES=["Salaries & Wages","Sales & Marketing","Travel & Accomodation","Professional Fees","Office Expense"];
const OPEX_LABELS={SW0001:"Salaries & Wages",SM0001:"Sales & Marketing",TA0001:"Travel & Accommodation",PF0001:"Professional Fees",OF0001:"Office Expenses"};

// Molecule mapping to Consolidado names
const MOL_MAP={"Ácido Hialurónico 1%":"Hyaxum","Ácido Hialurónico 1.5%":"Hyaxum","Ácido Hialurónico 2%":"Hyaxum","Bevacizumab 100":"Bevacizumab","Bevacizumab 400":"Bevacizumab","Hyaxum 1":"Hyaxum","Hyaxum 1.5 Plus":"Hyaxum","Hyaxum 2 Pro":"Hyaxum","Euxara":"Euxara","Fixed":"Fixed","ACHI":"Hyaxum","BEVA":"Bevacizumab","TERI":"Euxara","FIXED":"Fixed","PELI":"Peli","DENO":"Deno","SIME":"Sime","ACMI":"Acmi","Hyaxum 2% Pro":"Hyaxum","Hyaxum 1.5% Plus":"Hyaxum","Hyaxum 1.5 % Plus":"Hyaxum","Ácido Hialurónico 1.5%":"Hyaxum"};
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

const D=[["143652.15681045418","Forecast",7,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1600.0],["143652.15681045418","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1600.0],["18890.999999999993","Forecast",9,"Teriparatida","SAOS","—","—","Maxigen Biotech",1600.0],["18890.999999999993","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1600.0],["219265.8347223152","Forecast",9,"Teriparatida","SAOS","—","—","Maxigen Biotech",2000.0],["250139.80932062137","Forecast",9,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",4400.0],["387265.83472231484","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",5000.0],["7899.999999999997","Forecast",7,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1600.0],["9899.999999999993","Forecast",9,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1600.0],["Beginning Inventory","Forecast",8,"FIXED","FIXED","—","—","Maxigen Biotech",1515.87],["Beginning Inventory","Forecast",8,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1515.87],["Beginning Inventory","Forecast",9,"FIXED","FIXED","—","—","Maxigen Biotech",1417.72],["Beginning Inventory","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1417.72],["Beginning Inventory","Forecast",10,"FIXED","FIXED","—","—","Maxigen Biotech",1251.03],["Beginning Inventory","Forecast",10,"Teriparatida","SAOS","—","—","Maxigen Biotech",1515.87],["Beginning Inventory","Forecast",10,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1515.87],["Beginning Inventory","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1515.87],["Beginning Inventory","Forecast",10,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1251.03],["Beginning Inventory","Forecast",11,"FIXED","FIXED","—","—","Maxigen Biotech",1042.26],["Beginning Inventory","Forecast",11,"Teriparatida","SAOS","—","—","Maxigen Biotech",1417.72],["Beginning Inventory","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1417.72],["Beginning Inventory","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1417.72],["Beginning Inventory","Forecast",11,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1042.26],["Beginning Inventory","Forecast",12,"FIXED","FIXED","—","—","Maxigen Biotech",791.44],["Beginning Inventory","Forecast",12,"Teriparatida","SAOS","—","—","Maxigen Biotech",1251.03],["Beginning Inventory","Forecast",12,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1251.03],["Beginning Inventory","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1251.03],["Beginning Inventory","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",791.44],["COGS","Forecast",7,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",33050.37],["COGS","Forecast",8,"Teriparatida","SAOS","—","OK","Maxigen Biotech",10126.15],["COGS","Forecast",8,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",39660.45],["COGS","Forecast",9,"Teriparatida","SAOS","—","OK","Maxigen Biotech",336813.29],["COGS","Forecast",9,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",9060.09],["COGS","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",22227.82],["COGS","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",46270.52],["COGS","Forecast",10,"Teriparatida","SAOS","—","OK","Maxigen Biotech",402150.72],["COGS","Forecast",10,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",10872.11],["COGS","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",26673.38],["COGS","Forecast",10,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",78586.45],["COGS","Forecast",11,"Teriparatida","SAOS","—","OK","Maxigen Biotech",486134.35],["COGS","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",12684.13],["COGS","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",31118.94],["COGS","Forecast",11,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",98416.67],["COGS","Forecast",12,"Teriparatida","SAOS","—","OK","Maxigen Biotech",786915.57],["COGS","Forecast",12,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",21542.88],["COGS","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",52852.8],["COGS","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",118246.9],["Ending Inventory","Forecast",7,"FIXED","FIXED","—","—","Maxigen Biotech",1515.87],["Ending Inventory","Forecast",7,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1515.87],["Ending Inventory","Forecast",8,"FIXED","FIXED","—","—","Maxigen Biotech",1417.72],["Ending Inventory","Forecast",8,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1417.72],["Ending Inventory","Forecast",9,"FIXED","FIXED","—","—","Maxigen Biotech",1251.03],["Ending Inventory","Forecast",9,"Teriparatida","SAOS","—","—","Maxigen Biotech",1515.87],["Ending Inventory","Forecast",9,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1515.87],["Ending Inventory","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1515.87],["Ending Inventory","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1251.03],["Ending Inventory","Forecast",10,"FIXED","FIXED","—","—","Maxigen Biotech",1042.26],["Ending Inventory","Forecast",10,"Teriparatida","SAOS","—","—","Maxigen Biotech",1417.72],["Ending Inventory","Forecast",10,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1417.72],["Ending Inventory","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1417.72],["Ending Inventory","Forecast",10,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1042.26],["Ending Inventory","Forecast",11,"FIXED","FIXED","—","—","Maxigen Biotech",791.44],["Ending Inventory","Forecast",11,"Teriparatida","SAOS","—","—","Maxigen Biotech",1251.03],["Ending Inventory","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1251.03],["Ending Inventory","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1251.03],["Ending Inventory","Forecast",11,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",791.44],["Ending Inventory","Forecast",12,"FIXED","FIXED","—","—","Maxigen Biotech",2100.11],["Ending Inventory","Forecast",12,"Teriparatida","SAOS","—","—","Maxigen Biotech",1042.26],["Ending Inventory","Forecast",12,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1042.26],["Ending Inventory","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1042.26],["Ending Inventory","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",2100.11],["Mobility","Forecast",1,"FIXED","FIXED","—","OK","Maxigen Biotech",112120.69],["Mobility","Forecast",2,"FIXED","FIXED","—","OK","Maxigen Biotech",112120.69],["Mobility","Forecast",3,"FIXED","FIXED","—","OK","Maxigen Biotech",181672.41],["Mobility","Forecast",3,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",4,"FIXED","FIXED","—","OK","Maxigen Biotech",181672.41],["Mobility","Forecast",4,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",5,"FIXED","FIXED","—","OK","Maxigen Biotech",202448.28],["Mobility","Forecast",5,"Teriparatida","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",5,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",6,"FIXED","FIXED","—","OK","Maxigen Biotech",202448.28],["Mobility","Forecast",6,"Teriparatida","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",6,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",7,"FIXED","FIXED","—","OK","Maxigen Biotech",202448.28],["Mobility","Forecast",7,"Teriparatida","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",7,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",8,"FIXED","FIXED","—","OK","Maxigen Biotech",202448.28],["Mobility","Forecast",8,"Teriparatida","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",8,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",9,"FIXED","FIXED","—","OK","Maxigen Biotech",202448.28],["Mobility","Forecast",9,"Teriparatida","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",10,"FIXED","FIXED","—","OK","Maxigen Biotech",202448.28],["Mobility","Forecast",10,"Teriparatida","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",11,"FIXED","FIXED","—","OK","Maxigen Biotech",229621.9],["Mobility","Forecast",11,"Teriparatida","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",36568.98],["Mobility","Forecast",12,"FIXED","FIXED","—","OK","Maxigen Biotech",229621.9],["Mobility","Forecast",12,"Teriparatida","SAOS","—","OK","Maxigen Biotech",32241.38],["Mobility","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",36568.98],["Months of Cover","Forecast",7,"FIXED","FIXED","—","—","Maxigen Biotech",7.0],["Months of Cover","Forecast",7,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",7.0],["Months of Cover","Forecast",8,"FIXED","FIXED","—","—","Maxigen Biotech",6.0],["Months of Cover","Forecast",8,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",6.0],["Months of Cover","Forecast",9,"FIXED","FIXED","—","—","Maxigen Biotech",5.0],["Months of Cover","Forecast",9,"Teriparatida","SAOS","—","—","Maxigen Biotech",7.0],["Months of Cover","Forecast",9,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",7.0],["Months of Cover","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",7.0],["Months of Cover","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",5.0],["Months of Cover","Forecast",10,"FIXED","FIXED","—","—","Maxigen Biotech",4.0],["Months of Cover","Forecast",10,"Teriparatida","SAOS","—","—","Maxigen Biotech",6.0],["Months of Cover","Forecast",10,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",6.0],["Months of Cover","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",6.0],["Months of Cover","Forecast",10,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",4.0],["Months of Cover","Forecast",11,"FIXED","FIXED","—","—","Maxigen Biotech",3.0],["Months of Cover","Forecast",11,"Teriparatida","SAOS","—","—","Maxigen Biotech",5.0],["Months of Cover","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",5.0],["Months of Cover","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",5.0],["Months of Cover","Forecast",11,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",3.0],["Months of Cover","Forecast",12,"FIXED","FIXED","—","—","Maxigen Biotech",6.0],["Months of Cover","Forecast",12,"Teriparatida","SAOS","—","—","Maxigen Biotech",4.0],["Months of Cover","Forecast",12,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",4.0],["Months of Cover","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",4.0],["Months of Cover","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",6.0],["Months of Life Remaining","Forecast",6,"FIXED","FIXED","—","—","Maxigen Biotech",36.0],["Months of Life Remaining","Forecast",6,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",36.0],["Months of Life Remaining","Forecast",7,"FIXED","FIXED","—","—","Maxigen Biotech",36.0],["Months of Life Remaining","Forecast",7,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",36.0],["Months of Life Remaining","Forecast",8,"FIXED","FIXED","—","—","Maxigen Biotech",35.0],["Months of Life Remaining","Forecast",8,"Teriparatida","SAOS","—","—","Maxigen Biotech",36.0],["Months of Life Remaining","Forecast",8,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",36.0],["Months of Life Remaining","Forecast",8,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",36.0],["Months of Life Remaining","Forecast",8,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",35.0],["Months of Life Remaining","Forecast",9,"FIXED","FIXED","—","—","Maxigen Biotech",34.0],["Months of Life Remaining","Forecast",9,"Teriparatida","SAOS","—","—","Maxigen Biotech",36.0],["Months of Life Remaining","Forecast",9,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",36.0],["Months of Life Remaining","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",36.0],["Months of Life Remaining","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",34.0],["Months of Life Remaining","Forecast",10,"FIXED","FIXED","—","—","Maxigen Biotech",33.0],["Months of Life Remaining","Forecast",10,"Teriparatida","SAOS","—","—","Maxigen Biotech",35.0],["Months of Life Remaining","Forecast",10,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",35.0],["Months of Life Remaining","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",35.0],["Months of Life Remaining","Forecast",10,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",33.0],["Months of Life Remaining","Forecast",11,"FIXED","FIXED","—","—","Maxigen Biotech",32.0],["Months of Life Remaining","Forecast",11,"Teriparatida","SAOS","—","—","Maxigen Biotech",34.0],["Months of Life Remaining","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",34.0],["Months of Life Remaining","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",34.0],["Months of Life Remaining","Forecast",11,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",32.0],["Months of Life Remaining","Forecast",12,"FIXED","FIXED","—","—","Maxigen Biotech",31.0],["Months of Life Remaining","Forecast",12,"Teriparatida","SAOS","—","—","Maxigen Biotech",33.0],["Months of Life Remaining","Forecast",12,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",33.0],["Months of Life Remaining","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",33.0],["Months of Life Remaining","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",31.0],["Net Sales","Forecast",8,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",226291.37],["Net Sales","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",271549.65],["Net Sales","Forecast",10,"Teriparatida","SAOS","—","OK","Maxigen Biotech",490546.53],["Net Sales","Forecast",10,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",54874.7],["Net Sales","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",142817.11],["Net Sales","Forecast",10,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",316807.92],["Net Sales","Forecast",11,"Teriparatida","SAOS","—","OK","Maxigen Biotech",588655.83],["Net Sales","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",65849.64],["Net Sales","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",171380.53],["Net Sales","Forecast",11,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",538070.6],["Net Sales","Forecast",12,"Teriparatida","SAOS","—","OK","Maxigen Biotech",686765.14],["Net Sales","Forecast",12,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",76824.58],["Net Sales","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",199943.95],["Net Sales","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",673845.42],["Oldest Lot Age (months)","Forecast",8,"FIXED","FIXED","—","—","Maxigen Biotech",1.0],["Oldest Lot Age (months)","Forecast",8,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1.0],["Oldest Lot Age (months)","Forecast",9,"FIXED","FIXED","—","—","Maxigen Biotech",2.0],["Oldest Lot Age (months)","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",2.0],["Oldest Lot Age (months)","Forecast",10,"FIXED","FIXED","—","—","Maxigen Biotech",3.0],["Oldest Lot Age (months)","Forecast",10,"Teriparatida","SAOS","—","—","Maxigen Biotech",1.0],["Oldest Lot Age (months)","Forecast",10,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1.0],["Oldest Lot Age (months)","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1.0],["Oldest Lot Age (months)","Forecast",10,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",3.0],["Oldest Lot Age (months)","Forecast",11,"FIXED","FIXED","—","—","Maxigen Biotech",4.0],["Oldest Lot Age (months)","Forecast",11,"Teriparatida","SAOS","—","—","Maxigen Biotech",2.0],["Oldest Lot Age (months)","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",2.0],["Oldest Lot Age (months)","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",2.0],["Oldest Lot Age (months)","Forecast",11,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",4.0],["Oldest Lot Age (months)","Forecast",12,"FIXED","FIXED","—","—","Maxigen Biotech",5.0],["Oldest Lot Age (months)","Forecast",12,"Teriparatida","SAOS","—","—","Maxigen Biotech",3.0],["Oldest Lot Age (months)","Forecast",12,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",3.0],["Oldest Lot Age (months)","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",3.0],["Oldest Lot Age (months)","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",5.0],["Operations","Forecast",3,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",55680.0],["Operations","Forecast",5,"Teriparatida","SAOS","—","—","Maxigen Biotech",2201193.0],["Operations","Forecast",5,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",55680.0],["Operations","Forecast",5,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",55680.0],["Operations","Forecast",6,"FIXED","FIXED","—","—","Maxigen Biotech",315840.0],["PO Placed","Forecast",4,"FIXED","FIXED","—","—","Maxigen Biotech",1600.0],["PO Placed","Forecast",4,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1600.0],["PO Placed","Forecast",6,"Teriparatida","SAOS","—","—","Maxigen Biotech",1600.0],["PO Placed","Forecast",6,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1600.0],["PO Placed","Forecast",6,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1600.0],["PO Placed","Forecast",9,"FIXED","FIXED","—","—","Maxigen Biotech",1600.0],["PO Placed","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1600.0],["PO Placed","Forecast",11,"Teriparatida","SAOS","—","—","Maxigen Biotech",1600.0],["PO Placed","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1600.0],["PO Placed","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1600.0],["PO Received","Forecast",7,"FIXED","FIXED","—","—","Maxigen Biotech",1600.0],["PO Received","Forecast",7,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1600.0],["PO Received","Forecast",9,"Teriparatida","SAOS","—","—","Maxigen Biotech",1600.0],["PO Received","Forecast",9,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",1600.0],["PO Received","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",1600.0],["PO Received","Forecast",12,"FIXED","FIXED","—","—","Maxigen Biotech",1600.0],["PO Received","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",1600.0],["Price","Forecast",6,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",6874.22],["Price","Forecast",7,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",6874.22],["Price","Forecast",8,"Teriparatida","SAOS","—","OK","Maxigen Biotech",6231.71],["Price","Forecast",8,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",1330.21],["Price","Forecast",8,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",1814.29],["Price","Forecast",8,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",6874.22],["Price","Forecast",9,"Teriparatida","SAOS","—","OK","Maxigen Biotech",6231.71],["Price","Forecast",9,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",1330.21],["Price","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",1814.29],["Price","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",6874.22],["Price","Forecast",10,"Teriparatida","SAOS","—","OK","Maxigen Biotech",6231.71],["Price","Forecast",10,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",1330.21],["Price","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",1814.29],["Price","Forecast",10,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",6874.22],["Price","Forecast",11,"Teriparatida","SAOS","—","OK","Maxigen Biotech",6231.71],["Price","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",1330.21],["Price","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",1814.29],["Price","Forecast",11,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",6874.22],["Price","Forecast",12,"Teriparatida","SAOS","—","OK","Maxigen Biotech",6231.71],["Price","Forecast",12,"Ácido Hialurónico 1%","SAOS","—","OK","Maxigen Biotech",1330.21],["Price","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","OK","Maxigen Biotech",1814.29],["Price","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","OK","Maxigen Biotech",6874.22],["Professional Services","Forecast",1,"FIXED","FIXED","—","OK","Maxigen Biotech",179015.0],["Professional Services","Forecast",2,"FIXED","FIXED","—","OK","Maxigen Biotech",90750.0],["Professional Services","Forecast",3,"FIXED","FIXED","—","OK","Maxigen Biotech",270750.0],["Professional Services","Forecast",4,"FIXED","FIXED","—","OK","Maxigen Biotech",317480.0],["Professional Services","Forecast",5,"FIXED","FIXED","—","OK","Maxigen Biotech",270750.0],["Professional Services","Forecast",6,"FIXED","FIXED","—","OK","Maxigen Biotech",270750.0],["Professional Services","Forecast",7,"FIXED","FIXED","—","OK","Maxigen Biotech",317480.0],["Professional Services","Forecast",8,"FIXED","FIXED","—","OK","Maxigen Biotech",270750.0],["Professional Services","Forecast",9,"FIXED","FIXED","—","OK","Maxigen Biotech",270750.0],["Professional Services","Forecast",10,"FIXED","FIXED","—","OK","Maxigen Biotech",317480.0],["Professional Services","Forecast",11,"FIXED","FIXED","—","OK","Maxigen Biotech",270750.0],["Professional Services","Forecast",12,"FIXED","FIXED","—","OK","Maxigen Biotech",270750.0],["Salaries & Wages","Forecast",1,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",1001250.86],["Salaries & Wages","Forecast",1,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",14882.0],["Salaries & Wages","Forecast",2,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",1042928.42],["Salaries & Wages","Forecast",2,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",14882.0],["Salaries & Wages","Forecast",3,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",1574456.16],["Salaries & Wages","Forecast",3,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",14882.0],["Salaries & Wages","Forecast",4,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",1684290.04],["Salaries & Wages","Forecast",4,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",14882.0],["Salaries & Wages","Forecast",5,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",2145164.08],["Salaries & Wages","Forecast",5,"Teriparatida","SAOS","—","mobiliti + HC","Maxigen Biotech",250261.8],["Salaries & Wages","Forecast",5,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",14882.0],["Salaries & Wages","Forecast",6,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",2145164.08],["Salaries & Wages","Forecast",6,"Teriparatida","SAOS","—","mobiliti + HC","Maxigen Biotech",250261.8],["Salaries & Wages","Forecast",6,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",14882.0],["Salaries & Wages","Forecast",7,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",2145164.08],["Salaries & Wages","Forecast",7,"Teriparatida","SAOS","—","mobiliti + HC","Maxigen Biotech",250261.8],["Salaries & Wages","Forecast",7,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",14882.0],["Salaries & Wages","Forecast",8,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",2156399.08],["Salaries & Wages","Forecast",8,"Teriparatida","SAOS","—","mobiliti + HC","Maxigen Biotech",250261.8],["Salaries & Wages","Forecast",8,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",14882.0],["Salaries & Wages","Forecast",9,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",2145164.08],["Salaries & Wages","Forecast",9,"Teriparatida","SAOS","—","mobiliti + HC","Maxigen Biotech",250261.8],["Salaries & Wages","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",14882.0],["Salaries & Wages","Forecast",10,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",2557983.77],["Salaries & Wages","Forecast",10,"Teriparatida","SAOS","—","mobiliti + HC","Maxigen Biotech",250261.8],["Salaries & Wages","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",14882.0],["Salaries & Wages","Forecast",11,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",2302312.2],["Salaries & Wages","Forecast",11,"Teriparatida","SAOS","—","mobiliti + HC","Maxigen Biotech",250261.8],["Salaries & Wages","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",15819.57],["Salaries & Wages","Forecast",12,"FIXED","FIXED","—","mobiliti + HC","Maxigen Biotech",2327876.64],["Salaries & Wages","Forecast",12,"Teriparatida","SAOS","—","mobiliti + HC","Maxigen Biotech",250261.8],["Salaries & Wages","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","mobiliti + HC","Maxigen Biotech",15819.57],["Sales & Marketing","Forecast",1,"FIXED","FIXED","—","MKT","Maxigen Biotech",135000.0],["Sales & Marketing","Forecast",2,"FIXED","FIXED","—","MKT","Maxigen Biotech",635000.0],["Sales & Marketing","Forecast",2,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Sales & Marketing","Forecast",3,"FIXED","FIXED","—","MKT","Maxigen Biotech",135000.0],["Sales & Marketing","Forecast",3,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Sales & Marketing","Forecast",4,"FIXED","FIXED","—","MKT","Maxigen Biotech",650960.0],["Sales & Marketing","Forecast",4,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Sales & Marketing","Forecast",5,"FIXED","FIXED","—","MKT","Maxigen Biotech",135000.0],["Sales & Marketing","Forecast",5,"Teriparatida","SAOS","—","MKT","Maxigen Biotech",233333.33],["Sales & Marketing","Forecast",5,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Sales & Marketing","Forecast",6,"FIXED","FIXED","—","MKT","Maxigen Biotech",135000.0],["Sales & Marketing","Forecast",6,"Teriparatida","SAOS","—","MKT","Maxigen Biotech",233333.33],["Sales & Marketing","Forecast",6,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Sales & Marketing","Forecast",7,"FIXED","FIXED","—","MKT","Maxigen Biotech",450960.0],["Sales & Marketing","Forecast",7,"Teriparatida","SAOS","—","MKT","Maxigen Biotech",233333.33],["Sales & Marketing","Forecast",7,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Sales & Marketing","Forecast",8,"FIXED","FIXED","—","MKT","Maxigen Biotech",135000.0],["Sales & Marketing","Forecast",8,"Teriparatida","SAOS","—","MKT","Maxigen Biotech",233333.33],["Sales & Marketing","Forecast",8,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Sales & Marketing","Forecast",9,"FIXED","FIXED","—","MKT","Maxigen Biotech",135000.0],["Sales & Marketing","Forecast",9,"Teriparatida","SAOS","—","MKT","Maxigen Biotech",233333.33],["Sales & Marketing","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Sales & Marketing","Forecast",10,"FIXED","FIXED","—","MKT","Maxigen Biotech",450960.0],["Sales & Marketing","Forecast",10,"Teriparatida","SAOS","—","MKT","Maxigen Biotech",233333.33],["Sales & Marketing","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Sales & Marketing","Forecast",11,"FIXED","FIXED","—","MKT","Maxigen Biotech",135000.0],["Sales & Marketing","Forecast",11,"Teriparatida","SAOS","—","MKT","Maxigen Biotech",233333.33],["Sales & Marketing","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Sales & Marketing","Forecast",12,"FIXED","FIXED","—","MKT","Maxigen Biotech",450960.0],["Sales & Marketing","Forecast",12,"Teriparatida","SAOS","—","MKT","Maxigen Biotech",264652.5],["Sales & Marketing","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","MKT","Maxigen Biotech",242906.5],["Software & Hardware","Forecast",1,"FIXED","FIXED","—","—","Maxigen Biotech",131384.0],["Software & Hardware","Forecast",1,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84342.67],["Software & Hardware","Forecast",2,"FIXED","FIXED","—","—","Maxigen Biotech",131384.0],["Software & Hardware","Forecast",2,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84342.67],["Software & Hardware","Forecast",3,"FIXED","FIXED","—","—","Maxigen Biotech",272878.0],["Software & Hardware","Forecast",3,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84342.67],["Software & Hardware","Forecast",4,"FIXED","FIXED","—","—","Maxigen Biotech",144774.0],["Software & Hardware","Forecast",4,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84342.67],["Software & Hardware","Forecast",5,"FIXED","FIXED","—","—","Maxigen Biotech",279038.0],["Software & Hardware","Forecast",5,"Teriparatida","SAOS","—","—","Maxigen Biotech",64308.0],["Software & Hardware","Forecast",5,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84342.67],["Software & Hardware","Forecast",6,"FIXED","FIXED","—","—","Maxigen Biotech",152038.0],["Software & Hardware","Forecast",6,"Teriparatida","SAOS","—","—","Maxigen Biotech",4468.0],["Software & Hardware","Forecast",6,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84342.67],["Software & Hardware","Forecast",7,"FIXED","FIXED","—","—","Maxigen Biotech",127038.0],["Software & Hardware","Forecast",7,"Teriparatida","SAOS","—","—","Maxigen Biotech",4468.0],["Software & Hardware","Forecast",7,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84342.67],["Software & Hardware","Forecast",8,"FIXED","FIXED","—","—","Maxigen Biotech",127038.0],["Software & Hardware","Forecast",8,"Teriparatida","SAOS","—","—","Maxigen Biotech",4468.0],["Software & Hardware","Forecast",8,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84342.67],["Software & Hardware","Forecast",9,"FIXED","FIXED","—","—","Maxigen Biotech",127038.0],["Software & Hardware","Forecast",9,"Teriparatida","SAOS","—","—","Maxigen Biotech",4468.0],["Software & Hardware","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84342.67],["Software & Hardware","Forecast",10,"FIXED","FIXED","—","—","Maxigen Biotech",127038.0],["Software & Hardware","Forecast",10,"Teriparatida","SAOS","—","—","Maxigen Biotech",4468.0],["Software & Hardware","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84342.67],["Software & Hardware","Forecast",11,"FIXED","FIXED","—","—","Maxigen Biotech",174505.05],["Software & Hardware","Forecast",11,"Teriparatida","SAOS","—","—","Maxigen Biotech",4468.0],["Software & Hardware","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",89656.26],["Software & Hardware","Forecast",12,"FIXED","FIXED","—","—","Maxigen Biotech",146149.43],["Software & Hardware","Forecast",12,"Teriparatida","SAOS","—","—","Maxigen Biotech",4468.0],["Software & Hardware","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",89656.26],["Total Demand (Vol)","Forecast",6,"FIXED","FIXED","—","—","Maxigen Biotech",70.11],["Total Demand (Vol)","Forecast",6,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",70.11],["Total Demand (Vol)","Forecast",7,"FIXED","FIXED","—","—","Maxigen Biotech",84.13],["Total Demand (Vol)","Forecast",7,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",84.13],["Total Demand (Vol)","Forecast",8,"FIXED","FIXED","—","—","Maxigen Biotech",98.15],["Total Demand (Vol)","Forecast",8,"Teriparatida","SAOS","—","—","Maxigen Biotech",70.11],["Total Demand (Vol)","Forecast",8,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",70.11],["Total Demand (Vol)","Forecast",8,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",70.11],["Total Demand (Vol)","Forecast",8,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",98.15],["Total Demand (Vol)","Forecast",9,"FIXED","FIXED","—","—","Maxigen Biotech",166.7],["Total Demand (Vol)","Forecast",9,"Teriparatida","SAOS","—","—","Maxigen Biotech",84.13],["Total Demand (Vol)","Forecast",9,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",84.13],["Total Demand (Vol)","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",84.13],["Total Demand (Vol)","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",166.7],["Total Demand (Vol)","Forecast",10,"FIXED","FIXED","—","—","Maxigen Biotech",208.76],["Total Demand (Vol)","Forecast",10,"Teriparatida","SAOS","—","—","Maxigen Biotech",98.15],["Total Demand (Vol)","Forecast",10,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",98.15],["Total Demand (Vol)","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",98.15],["Total Demand (Vol)","Forecast",10,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",208.76],["Total Demand (Vol)","Forecast",11,"FIXED","FIXED","—","—","Maxigen Biotech",250.83],["Total Demand (Vol)","Forecast",11,"Teriparatida","SAOS","—","—","Maxigen Biotech",166.7],["Total Demand (Vol)","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",166.7],["Total Demand (Vol)","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",166.7],["Total Demand (Vol)","Forecast",11,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",250.83],["Total Demand (Vol)","Forecast",12,"FIXED","FIXED","—","—","Maxigen Biotech",291.33],["Total Demand (Vol)","Forecast",12,"Teriparatida","SAOS","—","—","Maxigen Biotech",208.76],["Total Demand (Vol)","Forecast",12,"Ácido Hialurónico 1%","SAOS","—","—","Maxigen Biotech",208.76],["Total Demand (Vol)","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","—","Maxigen Biotech",208.76],["Total Demand (Vol)","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","—","Maxigen Biotech",291.33],["Travel & Accomodation","Forecast",1,"FIXED","FIXED","—","T&A","Maxigen Biotech",72000.0],["Travel & Accomodation","Forecast",2,"FIXED","FIXED","—","T&A","Maxigen Biotech",78000.0],["Travel & Accomodation","Forecast",3,"FIXED","FIXED","—","T&A","Maxigen Biotech",514000.0],["Travel & Accomodation","Forecast",3,"Ácido Hialurónico 2%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",4,"FIXED","FIXED","—","T&A","Maxigen Biotech",78000.0],["Travel & Accomodation","Forecast",4,"Ácido Hialurónico 2%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",5,"FIXED","FIXED","—","T&A","Maxigen Biotech",93000.0],["Travel & Accomodation","Forecast",5,"Teriparatida","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",5,"Ácido Hialurónico 1%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",5,"Ácido Hialurónico 1.5%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",5,"Ácido Hialurónico 2%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",6,"FIXED","FIXED","—","T&A","Maxigen Biotech",535000.0],["Travel & Accomodation","Forecast",6,"Teriparatida","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",6,"Ácido Hialurónico 1%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",6,"Ácido Hialurónico 1.5%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",6,"Ácido Hialurónico 2%","SAOS","—","T&A","Maxigen Biotech",221000.0],["Travel & Accomodation","Forecast",7,"FIXED","FIXED","—","T&A","Maxigen Biotech",219000.0],["Travel & Accomodation","Forecast",7,"Teriparatida","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",7,"Ácido Hialurónico 1%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",7,"Ácido Hialurónico 1.5%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",7,"Ácido Hialurónico 2%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",8,"FIXED","FIXED","—","T&A","Maxigen Biotech",125000.0],["Travel & Accomodation","Forecast",8,"Teriparatida","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",8,"Ácido Hialurónico 1%","SAOS","—","T&A","Maxigen Biotech",221000.0],["Travel & Accomodation","Forecast",8,"Ácido Hialurónico 1.5%","SAOS","—","T&A","Maxigen Biotech",221000.0],["Travel & Accomodation","Forecast",8,"Ácido Hialurónico 2%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",9,"FIXED","FIXED","—","T&A","Maxigen Biotech",561000.0],["Travel & Accomodation","Forecast",9,"Teriparatida","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",9,"Ácido Hialurónico 1%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",9,"Ácido Hialurónico 1.5%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",9,"Ácido Hialurónico 2%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",10,"FIXED","FIXED","—","T&A","Maxigen Biotech",225000.0],["Travel & Accomodation","Forecast",10,"Teriparatida","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",10,"Ácido Hialurónico 1%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",10,"Ácido Hialurónico 1.5%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",10,"Ácido Hialurónico 2%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",11,"FIXED","FIXED","—","T&A","Maxigen Biotech",119000.0],["Travel & Accomodation","Forecast",11,"Teriparatida","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",11,"Ácido Hialurónico 1%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",11,"Ácido Hialurónico 1.5%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",11,"Ácido Hialurónico 2%","SAOS","—","T&A","Maxigen Biotech",23818.72],["Travel & Accomodation","Forecast",12,"FIXED","FIXED","—","T&A","Maxigen Biotech",205000.0],["Travel & Accomodation","Forecast",12,"Teriparatida","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",12,"Ácido Hialurónico 1%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",12,"Ácido Hialurónico 1.5%","SAOS","—","T&A","Maxigen Biotech",21000.0],["Travel & Accomodation","Forecast",12,"Ácido Hialurónico 2%","SAOS","—","T&A","Maxigen Biotech",23818.72]];
const B=[["","Activos",0,"Activos",0,-2810929.71,24104850.51,3568859.62,-8929701.68,-1338384.73,0,0,0,0,0,0,0],["100-01-000","Activo A Corto Plazo",1,"Activos",0,-3156457.43,23242378.85,-2581144.67,-9190741.78,-1793154.82,0,0,0,0,0,0,0],["102-00-000","Bancos",2,"Activos",0,675511.18,-575501.64,18306.89,89295.21,-2236804.48,0,0,0,0,0,0,0],["102-01-000","Bancos Nacionales",3,"Activos",0,675511.18,-575501.64,18306.89,89295.21,-2236804.48,0,0,0,0,0,0,0],["102-01-001","Bbva Mxn 0124438019",4,"Activos",0,274602.77,-183084.68,25585.48,90260.36,-1006843.12,0,0,0,0,0,0,0],["102-01-002","Bbva Usd 0124438108",4,"Activos",0,400908.41,-392416.96,-7278.59,-965.15,-1229961.36,0,0,0,0,0,0,0],["102-01-000","Bancos Nacionales",3,"Activos",1,675511.18,-575501.64,18306.89,89295.21,-2236804.48,0,0,0,0,0,0,0],["102-00-000","Bancos",2,"Activos",1,675511.18,-575501.64,18306.89,89295.21,-2236804.48,0,0,0,0,0,0,0],["103-00-000","Inversiones",2,"Activos",0,-4093508.97,23630883.89,-2938770,-9459342.29,-331001.4,0,0,0,0,0,0,0],["103-01-000","Inversiones Temporales",3,"Activos",0,-4093508.97,23630883.89,-2938770,-9459342.29,-331001.4,0,0,0,0,0,0,0],["103-01-001","Bbva Fondo De Inversion",4,"Activos",0,-4093508.97,23630883.89,-2938770,-9459342.29,-331001.4,0,0,0,0,0,0,0],["103-01-000","Inversiones Temporales",3,"Activos",1,-4093508.97,23630883.89,-2938770,-9459342.29,-331001.4,0,0,0,0,0,0,0],["103-00-000","Inversiones",2,"Activos",1,-4093508.97,23630883.89,-2938770,-9459342.29,-331001.4,0,0,0,0,0,0,0],["109-00-000","Pagos Anticipados",2,"Activos",0,-14533.91,-14533.91,16619.42,-28783.11,26823.69,0,0,0,0,0,0,0],["109-01-000","Seg Y Fianzas Pagados X Anticipado Nal",3,"Activos",0,-14533.91,-14533.91,-14533.91,-14533.91,19473.69,0,0,0,0,0,0,0],["109-01-001","Seguros y Fianzas Nacionales",4,"Activos",0,-14533.91,-14533.91,-14533.91,-14533.91,19473.69,0,0,0,0,0,0,0],["109-01-000","Seg Y Fianzas Pagados X Anticipado Nal",3,"Activos",1,-14533.91,-14533.91,-14533.91,-14533.91,19473.69,0,0,0,0,0,0,0],["109-23-000","Otros Pagos Anticipados",3,"Activos",0,0,0,31153.33,-14249.2,7350,0,0,0,0,0,0,0],["109-23-001","Xperbit (Auditorias Trismetrales)",4,"Activos",0,0,0,31153.33,-15576.67,0,0,0,0,0,0,0,0],["109-23-002","Garantia Extendida de Disposiitivos Electronicos",4,"Activos",0,0,0,0,1327.47,0,0,0,0,0,0,0,0],["109-23-003","Negobit (Servicio Focalizacion de informacion anual)",4,"Activos",0,0,0,0,0,7350,0,0,0,0,0,0,0],["109-23-000","Otros Pagos Anticipados",3,"Activos",1,0,0,31153.33,-14249.2,7350,0,0,0,0,0,0,0],["109-00-000","Pagos Anticipados",2,"Activos",1,-14533.91,-14533.91,16619.42,-28783.11,26823.69,0,0,0,0,0,0,0],["113-00-000","Impuestos A Favor",2,"Activos",0,70989.26,108279.47,201573.45,237662,0,0,0,0,0,0,0,0],["113-01-000","Iva A Favor",3,"Activos",0,70989.26,108279.47,201573.45,237662,0,0,0,0,0,0,0,0],["113-01-013","Iva A Favor Enero 2026",4,"Activos",0,70989.26,0,0,0,0,0,0,0,0,0,0,0],["113-01-014","Iva a Favor Febrero 2026",4,"Activos",0,0,108279.47,0,0,0,0,0,0,0,0,0,0],["113-01-015","Iva A Favor Marzo 2026",4,"Activos",0,0,0,201573.45,0,0,0,0,0,0,0,0,0],["113-01-016","Iva A Favor Abril 2026",4,"Activos",0,0,0,0,237662,0,0,0,0,0,0,0,0],["113-01-000","Iva A Favor",3,"Activos",1,70989.26,108279.47,201573.45,237662,0,0,0,0,0,0,0,0],["113-00-000","Impuestos A Favor",2,"Activos",1,70989.26,108279.47,201573.45,237662,0,0,0,0,0,0,0,0],["115-00-000","Inventario",2,"Activos",0,0,0,0,347186,0,0,0,0,0,0,0,0],["115-01-000","Inventario",3,"Activos",0,0,0,0,347186,0,0,0,0,0,0,0,0],["115-01-002","Inventario Transito",4,"Activos",0,0,0,0,347186,0,0,0,0,0,0,0,0],["115-01-000","Inventario",3,"Activos",1,0,0,0,347186,0,0,0,0,0,0,0,0],["115-00-000","Inventario",2,"Activos",1,0,0,0,347186,0,0,0,0,0,0,0,0],["118-00-000","Impuestos Acreditables Pagados",2,"Activos",0,0,0,0,0,148295.9,0,0,0,0,0,0,0],["118-01-000","Iva Acreditable Pagado",3,"Activos",0,0,0,0,0,148295.9,0,0,0,0,0,0,0],["118-01-001","16% Iva acreditable Pagado",4,"Activos",0,0,0,0,0,148295.9,0,0,0,0,0,0,0],["118-01-000","Iva Acreditable Pagado",3,"Activos",1,0,0,0,0,148295.9,0,0,0,0,0,0,0],["118-00-000","Impuestos Acreditables Pagados",2,"Activos",1,0,0,0,0,148295.9,0,0,0,0,0,0,0],["119-00-000","Impuestos Acreditables Por Pagar",2,"Activos",0,50209.25,-21249.68,5579.23,-28107.81,-16742.94,0,0,0,0,0,0,0],["119-01-000","Iva Pendiente De Pago",3,"Activos",0,50209.25,-21249.68,5579.23,-28107.81,-16742.94,0,0,0,0,0,0,0],["119-01-001","Iva acreditable pendiente 16%",4,"Activos",0,50209.25,-21249.68,5579.23,-28107.81,-16742.94,0,0,0,0,0,0,0],["119-01-000","Iva Pendiente De Pago",3,"Activos",1,50209.25,-21249.68,5579.23,-28107.81,-16742.94,0,0,0,0,0,0,0],["119-00-000","Impuestos Acreditables Por Pagar",2,"Activos",1,50209.25,-21249.68,5579.23,-28107.81,-16742.94,0,0,0,0,0,0,0],["120-00-000","Anticipo A Proveedores",2,"Activos",0,154875.76,99.32,27137.88,-194324.34,616824.32,0,0,0,0,0,0,0],["120-02-000","Anticipo A Proveedores Extranjero",3,"Activos",0,154875.76,99.32,27137.88,-194324.34,616824.32,0,0,0,0,0,0,0],["120-02-001","Anticipo A Proveedores Extranjero",4,"Activos",0,154875.76,99.32,27137.88,-194324.34,616824.32,0,0,0,0,0,0,0],["120-02-000","Anticipo A Proveedores Extranjero",3,"Activos",1,154875.76,99.32,27137.88,-194324.34,616824.32,0,0,0,0,0,0,0],["120-00-000","Anticipo A Proveedores",2,"Activos",1,154875.76,99.32,27137.88,-194324.34,616824.32,0,0,0,0,0,0,0],["121-00-000","Otros Activos A Corto Plazo",2,"Activos",0,0,114401.4,88408.46,-154327.44,-549.91,0,0,0,0,0,0,0],["121-01-000","Otros Activos A Corto Plazo",3,"Activos",0,0,114401.4,88408.46,-154327.44,-549.91,0,0,0,0,0,0,0],["121-01-001","Gastos por Comprobar de Funcionarios y Empleados",4,"Activos",0,0,114401.4,88408.46,-154327.44,-549.91,0,0,0,0,0,0,0],["121-01-000","Otros Activos A Corto Plazo",3,"Activos",1,0,114401.4,88408.46,-154327.44,-549.91,0,0,0,0,0,0,0],["121-00-000","Otros Activos A Corto Plazo",2,"Activos",1,0,114401.4,88408.46,-154327.44,-549.91,0,0,0,0,0,0,0],["100-01-000","Activo A Corto Plazo",1,"Activos",1,-3156457.43,23242378.85,-2581144.67,-9190741.78,-1793154.82,0,0,0,0,0,0,0],["100-02-000","Activo A Largo Plazo",1,"Activos",0,345527.72,862471.66,6150004.29,261040.1,454770.09,0,0,0,0,0,0,0],["155-00-000","Mobiliario Y Equipo De Oficina",2,"Activos",0,0,3275,0,0,0,0,0,0,0,0,0,0],["155-01-000","Mobiliario Y Equipo De Oficina",3,"Activos",0,0,3275,0,0,0,0,0,0,0,0,0,0],["155-01-001","Mobiliario Y Equipo De Oficina",4,"Activos",0,0,3275,0,0,0,0,0,0,0,0,0,0],["155-01-000","Mobiliario Y Equipo De Oficina",3,"Activos",1,0,3275,0,0,0,0,0,0,0,0,0,0],["155-00-000","Mobiliario Y Equipo De Oficina",2,"Activos",1,0,3275,0,0,0,0,0,0,0,0,0,0],["156-00-000","Equipo De Cómputo",2,"Activos",0,21071.55,0,22540.52,30999.15,66086.44,0,0,0,0,0,0,0],["156-01-000","Equipo De Cómputo",3,"Activos",0,21071.55,0,22540.52,30999.15,66086.44,0,0,0,0,0,0,0],["156-01-001","Equipo De Cómputo",4,"Activos",0,21071.55,0,22540.52,30999.15,66086.44,0,0,0,0,0,0,0],["156-01-000","Equipo De Cómputo",3,"Activos",1,21071.55,0,22540.52,30999.15,66086.44,0,0,0,0,0,0,0],["156-00-000","Equipo De Cómputo",2,"Activos",1,21071.55,0,22540.52,30999.15,66086.44,0,0,0,0,0,0,0],["171-00-000","Depreciación Acumulada De Activos Fijos",2,"Activos",0,-3148.72,-3676.55,-3705,-4267.52,0,0,0,0,0,0,0,0],["171-04-001","Depr Acum De Mobiliario Y Equipo De Oficina",4,"Activos",0,-47.98,-48,-75,-75,0,0,0,0,0,0,0,0],["171-05-000","Depreciación Acumulada De Eq De Cómputo",3,"Activos",0,-3100.74,-3628.55,-3630,-4192.52,0,0,0,0,0,0,0,0],["171-05-001","Depreciación Acumulada De Equipo De Cómputo",4,"Activos",0,-3100.74,-3628.55,-3630,-4192.52,0,0,0,0,0,0,0,0],["171-05-000","Depreciación Acumulada De Eq De Cómputo",3,"Activos",1,-3100.74,-3628.55,-3630,-4192.52,0,0,0,0,0,0,0,0],["171-00-000","Depreciación Acumulada De Activos Fijos",2,"Activos",1,-3148.72,-3676.55,-3705,-4267.52,0,0,0,0,0,0,0,0],["176-00-000","Activos Intangibles Empresariales",2,"Activos",0,445417.5,1013189.56,6242765.83,341245.96,388683.65,0,0,0,0,0,0,0],["176-01-000","Activos Intangibles",3,"Activos",0,445417.5,1013189.56,6242765.83,341245.96,388683.65,0,0,0,0,0,0,0],["176-01-001","Activos Intangibles",4,"Activos",0,445417.5,1013189.56,6242765.83,341245.96,388683.65,0,0,0,0,0,0,0],["176-01-000","Activos Intangibles",3,"Activos",1,445417.5,1013189.56,6242765.83,341245.96,388683.65,0,0,0,0,0,0,0],["176-00-000","Activos Intangibles Empresariales",2,"Activos",1,445417.5,1013189.56,6242765.83,341245.96,388683.65,0,0,0,0,0,0,0],["183-00-000","Amortización Acumulada De Gastos Diferidos",2,"Activos",0,-117812.61,-150316.35,-111597.06,-114483.95,0,0,0,0,0,0,0,0],["183-04-000","Amortización Acumulada De Activos Intangibles",3,"Activos",0,-117812.61,-150316.35,-111597.06,-114483.95,0,0,0,0,0,0,0,0],["183-04-001","Amortización Acumulada De Activos Intangibles",4,"Activos",0,-117812.61,-150316.35,-111597.06,-114483.95,0,0,0,0,0,0,0,0],["183-04-000","Amortización Acumulada De Activos Intangibles",3,"Activos",1,-117812.61,-150316.35,-111597.06,-114483.95,0,0,0,0,0,0,0,0],["183-00-000","Amortización Acumulada De Gastos Diferidos",2,"Activos",1,-117812.61,-150316.35,-111597.06,-114483.95,0,0,0,0,0,0,0,0],["184-00-000","Depósitos En Garantía",2,"Activos",0,0,0,0,7546.46,0,0,0,0,0,0,0,0],["184-03-000","Otros Depósitos En Garantía",3,"Activos",0,0,0,0,7546.46,0,0,0,0,0,0,0,0],["184-03-001","Cooworking Chapultepec",4,"Activos",0,0,0,0,6248.46,0,0,0,0,0,0,0,0],["184-03-002","Radiomovil Dipsa",4,"Activos",0,0,0,0,1298,0,0,0,0,0,0,0,0],["184-03-000","Otros Depósitos En Garantía",3,"Activos",1,0,0,0,7546.46,0,0,0,0,0,0,0,0],["184-00-000","Depósitos En Garantía",2,"Activos",1,0,0,0,7546.46,0,0,0,0,0,0,0,0],["100-02-000","Activo A Largo Plazo",1,"Activos",1,345527.72,862471.66,6150004.29,261040.1,454770.09,0,0,0,0,0,0,0],["","Total Activos",0,"Activos",1,-2810929.71,24104850.51,3568859.62,-8929701.68,-1338384.73,0,0,0,0,0,0,0],["","Pasivos",0,"Pasivos",0,368907.96,139022.15,6200691.92,-6396047.92,-766601.88,0,0,0,0,0,0,0],["200-01-000","Pasivo A Corto Plazo",1,"Pasivos",0,368907.96,139098.95,6200880.08,-6395542.33,-766383.07,0,0,0,0,0,0,0],["201-00-000","Proveedores",2,"Pasivos",0,374789.6,-79674.37,6392219.44,-6465992.77,-244093.94,0,0,0,0,0,0,0],["201-01-000","Proveedores Nacionales",3,"Pasivos",0,365841.36,-164230.24,51914.14,-214724.6,-70500.94,0,0,0,0,0,0,0],["201-01-001","Proveedores Nacionales Sector Privado",4,"Pasivos",0,365841.36,-164230.24,51914.14,-214724.6,-70500.94,0,0,0,0,0,0,0],["201-01-000","Proveedores Nacionales",3,"Pasivos",1,365841.36,-164230.24,51914.14,-214724.6,-70500.94,0,0,0,0,0,0,0],["201-02-000","Proveedores Extranjeros",3,"Pasivos",0,8948.24,84555.87,6340305.3,-6251268.17,-173593,0,0,0,0,0,0,0],["201-02-001","Proveedores Extranjeros Sector Privado",4,"Pasivos",0,8948.24,84555.87,6340305.3,-6251268.17,-173593,0,0,0,0,0,0,0],["201-02-000","Proveedores Extranjeros",3,"Pasivos",1,8948.24,84555.87,6340305.3,-6251268.17,-173593,0,0,0,0,0,0,0],["201-00-000","Proveedores",2,"Pasivos",1,374789.6,-79674.37,6392219.44,-6465992.77,-244093.94,0,0,0,0,0,0,0],["205-00-000","Acreedores Diversos A Corto Plazo",2,"Pasivos",0,61539.65,194698.92,-196377.54,-83288.25,-39230.81,0,0,0,0,0,0,0],["205-06-000","Otros Acreedores Diversos A Corto Plazo",3,"Pasivos",0,61539.65,194698.92,-196377.54,-83288.25,-39230.81,0,0,0,0,0,0,0],["205-06-001","Tarjeta Clara",4,"Pasivos",0,61539.65,194698.92,-196377.54,-83288.25,-39230.81,0,0,0,0,0,0,0],["205-06-000","Otros Acreedores Diversos A Corto Plazo",3,"Pasivos",1,61539.65,194698.92,-196377.54,-83288.25,-39230.81,0,0,0,0,0,0,0],["205-00-000","Acreedores Diversos A Corto Plazo",2,"Pasivos",1,61539.65,194698.92,-196377.54,-83288.25,-39230.81,0,0,0,0,0,0,0],["210-00-000","Provisión De Sueldos Y Salarios",2,"Pasivos",0,36687.51,16990.53,39168.33,40916.17,0,0,0,0,0,0,0,0],["210-03-000","Provisión De Aguinaldo Por Pagar",3,"Pasivos",0,29606.74,27149.86,31497.15,32990.54,0,0,0,0,0,0,0,0],["210-03-001","Provisión De Aguinaldo Por Pagar",4,"Pasivos",0,29606.74,27149.86,31497.15,32990.54,0,0,0,0,0,0,0,0],["210-03-000","Provisión De Aguinaldo Por Pagar",3,"Pasivos",1,29606.74,27149.86,31497.15,32990.54,0,0,0,0,0,0,0,0],["210-08-001","Provision De Prima Vacacional",4,"Pasivos",0,7080.77,-10159.33,7671.18,7925.63,0,0,0,0,0,0,0,0],["210-00-000","Provisión De Sueldos Y Salarios",2,"Pasivos",1,36687.51,16990.53,39168.33,40916.17,0,0,0,0,0,0,0,0],["211-00-000","Provisión De Contribuciones Segsocial X Pagar",2,"Pasivos",0,-87751.41,81985.15,-60968.39,113002.35,-268528.16,0,0,0,0,0,0,0],["211-01-000","Provisión De Imss Patronal Por Pagar",3,"Pasivos",0,-2086.95,-2534.34,9316.83,2813.64,-54086.7,0,0,0,0,0,0,0],["211-01-001","Provisión De Imss Patronal Por Pagar",4,"Pasivos",0,-2086.95,-2534.34,9316.83,2813.64,-54086.7,0,0,0,0,0,0,0],["211-01-000","Provisión De Imss Patronal Por Pagar",3,"Pasivos",1,-2086.95,-2534.34,9316.83,2813.64,-54086.7,0,0,0,0,0,0,0],["211-02-000","Provisión De SAR Por Pagar",3,"Pasivos",0,-51231.58,55400.94,-46070.62,72226.62,-140562.36,0,0,0,0,0,0,0],["211-02-001","Provisión De SAR Por Pagar",4,"Pasivos",0,-51231.58,55400.94,-46070.62,72226.62,-140562.36,0,0,0,0,0,0,0],["211-02-000","Provisión De SAR Por Pagar",3,"Pasivos",1,-51231.58,55400.94,-46070.62,72226.62,-140562.36,0,0,0,0,0,0,0],["211-03-000","Provisión De Infonavit Por Pagar",3,"Pasivos",0,-34432.88,29118.55,-24214.6,37962.09,-73879.1,0,0,0,0,0,0,0],["211-03-001","Provisión De Infonavit Por Pagar",4,"Pasivos",0,-34432.88,29118.55,-24214.6,37962.09,-73879.1,0,0,0,0,0,0,0],["211-03-000","Provisión De Infonavit Por Pagar",3,"Pasivos",1,-34432.88,29118.55,-24214.6,37962.09,-73879.1,0,0,0,0,0,0,0],["211-00-000","Provisión De Contribuciones Segsocial X Pagar",2,"Pasivos",1,-87751.41,81985.15,-60968.39,113002.35,-268528.16,0,0,0,0,0,0,0],["212-00-000","Provisión De Imoto Estatal S Nómina X Pagar",2,"Pasivos",0,-631.47,-6569.62,1184.73,1293.83,-25194,0,0,0,0,0,0,0],["212-01-000","Provisión De Imoto Estatal S Nómina X Pagar",3,"Pasivos",0,-631.47,-6569.62,1184.73,1293.83,-25194,0,0,0,0,0,0,0],["212-01-001","3% Impuesto Estatal Sobre Nómina Por Pagar",4,"Pasivos",0,-631.47,-6569.62,1184.73,1293.83,-25194,0,0,0,0,0,0,0],["212-01-000","Provisión De Imoto Estatal S Nómina X Pagar",3,"Pasivos",1,-631.47,-6569.62,1184.73,1293.83,-25194,0,0,0,0,0,0,0],["212-00-000","Provisión De Imoto Estatal S Nómina X Pagar",2,"Pasivos",1,-631.47,-6569.62,1184.73,1293.83,-25194,0,0,0,0,0,0,0],["216-00-000","Impuestos Retenidos",2,"Pasivos",0,-15725.92,-68331.66,25653.51,-1473.66,-189336.16,0,0,0,0,0,0,0],["216-02-000","IImpuestos Ret de ISR x Sueldos y salarios",3,"Pasivos",0,-1236.19,-74400.36,8066.61,5807.45,-173197,0,0,0,0,0,0,0],["216-02-001","Impuestos Ret de ISR por Sueldos y salarios",4,"Pasivos",0,-1236.19,-74400.36,8066.61,5807.45,-173197,0,0,0,0,0,0,0],["216-02-000","IImpuestos Ret de ISR x Sueldos y salarios",3,"Pasivos",1,-1236.19,-74400.36,8066.61,5807.45,-173197,0,0,0,0,0,0,0],["216-04-000","Impuestos Ret De Isr X Servicios Prof",3,"Pasivos",0,-1671,73.01,10092.17,-8842.92,6041.87,0,0,0,0,0,0,0],["216-04-001","Impuestos Retenido por Servicios Profesional 10%",4,"Pasivos",0,-1671,73.01,10092.17,-8842.92,6041.87,0,0,0,0,0,0,0],["216-04-000","Impuestos Ret De Isr X Servicios Prof",3,"Pasivos",1,-1671,73.01,10092.17,-8842.92,6041.87,0,0,0,0,0,0,0],["216-09-000","Infonavit retenido a colaboradores",3,"Pasivos",0,0,0,0,1801.35,0,0,0,0,0,0,0,0],["216-09-001","Infonavit retenido empleados",4,"Pasivos",0,0,0,0,1801.35,0,0,0,0,0,0,0,0],["216-09-000","Infonavit retenido a colaboradores",3,"Pasivos",1,0,0,0,1801.35,0,0,0,0,0,0,0,0],["216-10-000","Impuestos Retenidos De Iva",3,"Pasivos",0,-4208,77.87,10766.91,-9434.77,6447.02,0,0,0,0,0,0,0],["216-10-003","Retención Iva por Honorarios 10.66%",4,"Pasivos",0,-4208,77.87,10766.91,-9434.77,6447.02,0,0,0,0,0,0,0],["216-10-000","Impuestos Retenidos De Iva",3,"Pasivos",1,-4208,77.87,10766.91,-9434.77,6447.02,0,0,0,0,0,0,0],["216-11-000","Retenciones De Imss A Los Trabaj",3,"Pasivos",0,-8340.69,5940.82,-3272.18,9195.23,-28628.05,0,0,0,0,0,0,0],["216-11-001","Retenciones De Imss Obrero",4,"Pasivos",0,-8340.69,5940.82,-3272.18,9195.23,-28628.05,0,0,0,0,0,0,0],["216-11-000","Retenciones De Imss A Los Trabaj",3,"Pasivos",1,-8340.69,5940.82,-3272.18,9195.23,-28628.05,0,0,0,0,0,0,0],["216-13-000","RESICO",3,"Pasivos",0,-270.04,-23,0,0,0,0,0,0,0,0,0,0],["216-13-001","RESICO 1.25%",4,"Pasivos",0,-270.04,-23,0,0,0,0,0,0,0,0,0,0],["216-13-000","RESICO",3,"Pasivos",1,-270.04,-23,0,0,0,0,0,0,0,0,0,0],["216-00-000","Impuestos Retenidos",2,"Pasivos",1,-15725.92,-68331.66,25653.51,-1473.66,-189336.16,0,0,0,0,0,0,0],["200-01-000","Pasivo A Corto Plazo",1,"Pasivos",1,368907.96,139098.95,6200880.08,-6395542.33,-766383.07,0,0,0,0,0,0,0],["200-02-000","Pasivo A Largo Plazo",1,"Pasivos",0,0,-76.8,-188.16,-505.59,-218.81,0,0,0,0,0,0,0],["259-00-000","Impuestos Diferidos",2,"Pasivos",0,0,-76.8,-188.16,-505.59,-218.81,0,0,0,0,0,0,0],["259-03-000","Otros Impuestos Diferidos",3,"Pasivos",0,0,-76.8,-188.16,-505.59,-218.81,0,0,0,0,0,0,0],["259-03-001","Tipo de Cambio - Impuestos Diferidos",4,"Pasivos",0,0,-76.8,-188.16,-505.59,-218.81,0,0,0,0,0,0,0],["259-03-000","Otros Impuestos Diferidos",3,"Pasivos",1,0,-76.8,-188.16,-505.59,-218.81,0,0,0,0,0,0,0],["259-00-000","Impuestos Diferidos",2,"Pasivos",1,0,-76.8,-188.16,-505.59,-218.81,0,0,0,0,0,0,0],["200-02-000","Pasivo A Largo Plazo",1,"Pasivos",1,0,-76.8,-188.16,-505.59,-218.81,0,0,0,0,0,0,0],["","Total Pasivos",0,"Pasivos",1,368907.96,139022.15,6200691.92,-6396047.92,-766601.88,0,0,0,0,0,0,0],["","Capital Contable",0,"Capital",0,-3177917.67,23955804.63,-2623728.57,-2541712.89,-563723.72,0,0,0,0,0,0,0],["300-01-000","Capital Social Fijo",1,"Capital",0,0,25958163.85,0,0,0,0,0,0,0,0,0,0],["301-00-000","Capital Social",2,"Capital",0,0,25958163.85,0,0,0,0,0,0,0,0,0,0],["301-02-000","Capital Variable",3,"Capital",0,0,25958163.85,0,0,0,0,0,0,0,0,0,0],["301-02-001","Elysian LLc Capital Variable",4,"Capital",0,0,25958163.85,0,0,0,0,0,0,0,0,0,0],["301-02-000","Capital Variable",3,"Capital",1,0,25958163.85,0,0,0,0,0,0,0,0,0,0],["301-00-000","Capital Social",2,"Capital",1,0,25958163.85,0,0,0,0,0,0,0,0,0,0],["300-01-000","Capital Social Fijo",1,"Capital",1,0,25958163.85,0,0,0,0,0,0,0,0,0,0],["","Período ganancias",0,"Capital",0,-3177917.67,-2002359.22,-2623728.57,-2541712.89,-563723.72,0,0,0,0,0,0,0],["","Total Capital Contable",0,"Capital",1,-3177917.67,23955804.63,-2623728.57,-2541712.89,-563723.72,0,0,0,0,0,0,0]];
const bVal=(row,month)=>{let s=0;for(let m=0;m<month;m++)s+=(row[5+m]||0);return s;};
const Fn=v=>{if(!v||v===0)return"—";const n=v<0,a=Math.abs(v);const s="$"+Math.round(a).toLocaleString("en-US");return n?"-"+s:s};

const F=v=>{if(!v||v===0)return"—";const n=v<0,a=Math.abs(v);const s="$"+Math.round(a).toLocaleString("en-US");return n?"-"+s:s};
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
    if (m <= cm) return gV(fd, pl, "Reales", m);
    return gV(fd, pl, "Forecast", m);
  };
  // For OpEx lines (codes) - only have Reales data
  const getOpex = (pl) => {
    if (mode === "forecast") return gV(fd, pl, "Forecast", m);
    if (mode === "reales") return m <= cm ? gV(fd, pl, "Reales", m) : 0;
    // consolidado: reales up to cm, forecast after
    if (m <= cm) return gV(fd, pl, "Reales", m);
    return gV(fd, pl, "Forecast", m);
  };

  const ns = getPL("Net Sales");
  const cogs = getPL("COGS");
  const gp = ns - cogs;
  const gmPct = ns ? gp / ns : 0;
const sw = getOpex("Salaries & Wages");
const sm = getOpex("Sales & Marketing");
const ta = getOpex("Travel & Accomodation");
const pf = getOpex("Professional Fees");
const of_ = getOpex("Office Expense");
  const qual = mode === "reales" ? 0 : gV(fd, "Quality", "Forecast", m); // Quality is forecast only
  const totOpex = sw + sm + ta + pf + of_ + qual;
  const totOpexPct = ns ? totOpex / ns : 0;
  const ebitda = gp - totOpex;
  const ebitdaPct = ns ? ebitda / ns : 0;
  const depr = getOpex("Depreciation & Amortization");
  const ebit = ebitda - depr;
  const ebitPct = ns ? ebit / ns : 0;

  return { ns, cogs, gp, gmPct, sw, sm, ta, pf, of: of_, qual, totOpex, totOpexPct, ebitda, ebitdaPct, depr, ebit, ebitPct };
}

const PL_KEYS = ["ns","cogs","gp","gmPct","sw","sm","ta","pf","of","qual","totOpex","totOpexPct","ebitda","ebitdaPct","depr","ebit","ebitPct"];
const PL_LABELS = {ns:"Net Sales",cogs:"COGS",gp:"Gross Profit",gmPct:"% Gross Margin",sw:"Salaries & Wages",sm:"Sales & Marketing",ta:"Travel & Accommodation",pf:"Professional Fees",of:"Office Expenses",qual:"Quality",totOpex:"TOTAL OPERATING EXPENSES",totOpexPct:"% Total Operating Expenses",ebitda:"EBITDA",ebitdaPct:"% EBITDA",depr:"Depreciation",ebit:"EBIT",ebitPct:"% EBIT"};
const PCT_KEYS = new Set(["gmPct","totOpexPct","ebitdaPct","ebitPct"]);
const BOLD_KEYS = new Set(["ns","gp","totOpex","ebitda","ebit"]);
const OPEX_KEY_SET = new Set(["cogs","sw","sm","ta","pf","of","qual"]);

export default function Dashboard() {
  const [cm, setCm] = useState(4);
  const [selMols, setSelMols] = useState([]);
  const [selAreas, setSelAreas] = useState([]);
  const [view, setView] = useState("consolidado");
  const [expP, setExpP] = useState({});
  const [expOpex, setExpOpex] = useState({});
  const [expComp, setExpComp] = useState({});
  const [expB, setExpB] = useState({});
  const [expArea, setExpArea] = useState({});
  const [expPL, setExpPL] = useState({});
  const [expCF, setExpCF] = useState({});
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
        const numKey = k === "gmPct" ? "gp" : k === "totOpexPct" ? "totOpex" : k === "ebitPct" ? "ebit" : "ebitda";
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
        (ytdM.reduce((s, m) => s + fcMonthly[m-1].ns, 0) ? ytdM.reduce((s, m) => s + fcMonthly[m-1][k === "gmPct" ? "gp" : k === "totOpexPct" ? "totOpex" : k === "ebitPct" ? "ebit" : "ebitda"], 0) / ytdM.reduce((s, m) => s + fcMonthly[m-1].ns, 0) : 0) :
        ytdM.reduce((s, m) => s + fcMonthly[m-1][k], 0);
      ytdRE[k] = PCT_KEYS.has(k) ?
        (ytdM.reduce((s, m) => s + reMonthly[m-1].ns, 0) ? ytdM.reduce((s, m) => s + reMonthly[m-1][k === "gmPct" ? "gp" : k === "totOpexPct" ? "totOpex" : k === "ebitPct" ? "ebit" : "ebitda"], 0) / ytdM.reduce((s, m) => s + reMonthly[m-1].ns, 0) : 0) :
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
  const OC_ALL=["Salaries & Wages","Professional Fees","Sales & Marketing","Travel & Accomodation","IT (Software-Hardware)","Office Expense","Operations","Depreciation & Amortization","Financial Expense","Financial Income","Others","Regulatory","Software & Hardware","Mobility"];
  const wf = useMemo(() => {
    const clsMap={};
    fd.filter(r=>r[1]==="Reales"&&OC_ALL.includes(r[0])&&r[2]===cm).forEach(r=>{
      const cls=r[5]||"Otros";if(!clsMap[cls])clsMap[cls]=0;clsMap[cls]+=Math.abs(r[8]);
    });
    const sorted=Object.entries(clsMap).sort((a,b)=>b[1]-a[1]).map(([name,val])=>({name:name.length>14?name.slice(0,13)+"…":name,val,fullName:name}));
    const total=sorted.reduce((s,x)=>s+x.val,0);
    let run=0;
    const bars=sorted.map(it=>{const s=run;run+=it.val;return{...it,start:s,end:run}});
    bars.push({name:"Total",val:0,start:0,end:total,isT:true,total});
    return bars;
  }, [fd, cm, ytdM]);

  // Pies
  const pieYTD = useMemo(() => { const map = {}; fd.filter(r => r[1] === "Reales" && OC_ALL.includes(r[0]) && ytdM.includes(r[2])).forEach(r => { const m = mapMol(r[3]); if (!map[m]) map[m] = 0; map[m] += Math.abs(r[8]) }); return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) })).filter(x => x.value > 0).sort((a, b) => b.value - a.value); }, [fd, ytdM]);
  const pieCM = useMemo(() => { const map = {}; fd.filter(r => r[1] === "Reales" && OC_ALL.includes(r[0]) && r[2] === cm).forEach(r => { const m = mapMol(r[3]); if (!map[m]) map[m] = 0; map[m] += Math.abs(r[8]) }); return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) })).filter(x => x.value > 0).sort((a, b) => b.value - a.value); }, [fd, cm]);

  // Pareto
  const pareto = useMemo(() => { const re = fd.filter(r => r[1] === "Reales" && r[2] === cm); const map = {}; re.forEach(r => { const p = r[7]; if (p === "NOAP" || p === "- - -" || p === "VARIOS") return; if (!map[p]) map[p] = { t: 0, items: {} }; map[p].t += r[8]; const c = r[6]; if (!map[p].items[c]) map[p].items[c] = 0; map[p].items[c] += r[8] }); const arr = Object.entries(map).map(([k, v]) => ({ partner: k, total: v.t, items: v.items })).sort((a, b) => Math.abs(b.total) - Math.abs(a.total)); const grand = arr.reduce((s, x) => s + Math.abs(x.total), 0); let cum = 0; return arr.map(x => { cum += Math.abs(x.total); return { ...x, cumPct: grand ? cum / grand : 0 } }); }, [fd, cm]);

  const toggleP = k => setExpP(p => ({ ...p, [k]: !p[k] }));


  const maxP = pareto.length ? Math.abs(pareto[0].total) : 1;
  const sel = { padding: "5px 10px", borderRadius: 6, border: "1px solid #D0D5E8", fontSize: 11, fontFamily: "inherit", background: "#fff", cursor: "pointer", color: "#1a1a2e" };
  const th = { fontSize: 9, color: "#8A90A8", fontWeight: 400, padding: "5px 6px", borderBottom: "1px solid #E4E8F2", whiteSpace: "nowrap" };
  const td = { fontSize: 10, padding: "5px 6px", borderBottom: "1px solid #f0f2fa" };
  const vc = v => v < 0 ? "#E24B4A" : v > 0 ? "#1D9E75" : "#ccc";
  const fv = (v, isPct) => isPct ? P(v) : F(v);
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => { if (percent < 0.05) return null; const r = innerRadius + (outerRadius - innerRadius) * 0.5; const x = cx + r * Math.cos(-midAngle * Math.PI / 180); const y = cy + r * Math.sin(-midAngle * Math.PI / 180); return <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={500}>{`${(percent * 100).toFixed(0)}%`}</text> };






  // ═══ AREA × MONTH TABLE ═══
  const areaTable = useMemo(() => {
    const realOpex = fd.filter(r => r[1] === "Reales" && OC_ALL.includes(r[0]) && ytdM.includes(r[2]));
    const areaNames = [...new Set(realOpex.map(r => r[4]))].filter(a => a !== "—").sort();
    return areaNames.map(area => {
      const areaRows = realOpex.filter(r => r[4] === area);
      const monthly = {};
      ytdM.forEach(m => { monthly[m] = areaRows.filter(r => r[2] === m).reduce((s, r) => s + r[8], 0); });
      const total = Object.values(monthly).reduce((s, v) => s + v, 0);
      // Group by Molecule
      const molMap = {};
      areaRows.forEach(r => {
        const mol = mapMol(r[3]);
        if (!molMap[mol]) molMap[mol] = { monthly: {}, total: 0, cls: {} };
        ytdM.forEach(m => { if (!molMap[mol].monthly[m]) molMap[mol].monthly[m] = 0; });
        molMap[mol].monthly[r[2]] = (molMap[mol].monthly[r[2]] || 0) + r[8];
        molMap[mol].total += r[8];
        // Sub-group by Clasificación
        const cls = r[5] || "—";
        if (!molMap[mol].cls[cls]) molMap[mol].cls[cls] = { monthly: {}, total: 0 };
        ytdM.forEach(m => { if (!molMap[mol].cls[cls].monthly[m]) molMap[mol].cls[cls].monthly[m] = 0; });
        molMap[mol].cls[cls].monthly[r[2]] = (molMap[mol].cls[cls].monthly[r[2]] || 0) + r[8];
        molMap[mol].cls[cls].total += r[8];
      });
      return { area, monthly, total, mols: molMap };
    });
  }, [fd, ytdM]);
  const toggleArea = k => setExpArea(p => ({ ...p, [k]: !p[k] }));



  // ═══ AREA DE TRABAJO × MONTH TABLE ═══
  const plLineTable = useMemo(() => {
    const realOpex = fd.filter(r => r[1] === "Reales" && OC_ALL.includes(r[0]) && ytdM.includes(r[2]));
    const atNames = [...new Set(realOpex.map(r => r[9] || "—"))].filter(a => a !== "—").sort();
    return atNames.map(at => {
      const atRows = realOpex.filter(r => (r[9] || "—") === at);
      const monthly = {};
      ytdM.forEach(m => { monthly[m] = atRows.filter(r => r[2] === m).reduce((s, r) => s + r[8], 0); });
      const total = Object.values(monthly).reduce((s, v) => s + v, 0);
      const clsMap = {};
      atRows.forEach(r => {
        const cls = r[5] || "—";
        if (!clsMap[cls]) clsMap[cls] = { monthly: {}, total: 0 };
        ytdM.forEach(m => { if (!clsMap[cls].monthly[m]) clsMap[cls].monthly[m] = 0; });
        clsMap[cls].monthly[r[2]] = (clsMap[cls].monthly[r[2]] || 0) + r[8];
        clsMap[cls].total += r[8];
      });
      return { pl: at, monthly, total, cls: clsMap };
    });
  }, [fd, ytdM]);
  const togglePL = k => setExpPL(p => ({ ...p, [k]: !p[k] }));

  // ═══ CASH FLOW (MÉTODO INDIRECTO) ═══
  const OPEN_CASH = 4955698;
  const toggleCF = k => setExpCF(p => ({ ...p, [k]: !p[k] }));

  const cashFlow = useMemo(() => {
    if (!B || B.length === 0) return null;

    // Categorize D4 accounts by type using section + code
    const categorize = (r) => {
      const code = r[0] || "", section = r[3] || "", name = (r[1]||"").toLowerCase();
      const c3 = code.substring(0,3);
      if (c3 === "101" || c3 === "102") return "cash";
      if (name.includes("depreci") || name.includes("amortiz")) return "deprec";
      if (section === "Activos" && parseInt(c3) >= 150) return "fixed";
      if (section === "Activos") return "curr_asset";
      if (section === "Pasivos") return "curr_liab";
      if (r[1] === "Período ganancias") return "net_income";
      if (section === "Capital") return "equity";
      return "other";
    };

    // Get D4 non-total accounts with data
    const accounts = B.filter(r => r[2] === 4 && !r[4] && r.slice(5).some(v => v !== 0))
      .map(r => ({ ...r, cat: categorize(r), name: r[1], code: r[0], vals: r.slice(5) }));

    // Período ganancias (D0, not D4)
    const niRow = B.find(r => r[1] === "Período ganancias");

    // Group accounts by CF category
    const groups = {};
    accounts.forEach(a => { if (!groups[a.cat]) groups[a.cat] = []; groups[a.cat].push(a); });

    // Build monthly CF
    const months = MO.map((mName, mi) => {
      // Net Income
      const netIncome = niRow ? (niRow[5 + mi] || 0) : 0;

      // Depreciation & Amortization (contra-assets, movement is negative when D&A increases)
      // Add back: multiply by -1 (negative movement → positive add-back)
      const depAccts = groups.deprec || [];
      const deprAmort = depAccts.reduce((s, a) => s + (a.vals[mi] || 0), 0) * -1;

      // Changes in working capital
      // Current Assets (excl cash): increase uses cash → multiply by -1
      const caAccts = groups.curr_asset || [];
      const wc_assets = caAccts.reduce((s, a) => s + (a.vals[mi] || 0), 0) * -1;

      // Current Liabilities: increase generates cash → use as-is (positive = increase)
      const clAccts = groups.curr_liab || [];
      const wc_liabs = clAccts.reduce((s, a) => s + (a.vals[mi] || 0), 0);

      const totalOp = netIncome + deprAmort + wc_assets + wc_liabs;

      // Investing: Fixed assets (excl depreciation) increase uses cash → multiply by -1
      const faAccts = groups.fixed || [];
      const capex = faAccts.reduce((s, a) => s + (a.vals[mi] || 0), 0) * -1;
      const totalInv = capex;

      // Financing: Equity increase = inflow → use as-is
      const eqAccts = groups.equity || [];
      const equityChg = eqAccts.reduce((s, a) => s + (a.vals[mi] || 0), 0);
      const totalFin = equityChg;

      // Net change & cash verification
      const netChange = totalOp + totalInv + totalFin;
      const cashActual = (groups.cash || []).reduce((s, a) => s + (a.vals[mi] || 0), 0);

      return { name: mName, m: mi+1, netIncome, deprAmort, wc_assets, wc_liabs, totalOp, capex, totalInv, equityChg, totalFin, netChange, cashActual };
    });

    // Beginning/Ending balances
    let bal = OPEN_CASH;
    months.forEach(mo => { mo.beginBal = bal; mo.endBal = bal + mo.netChange; bal = mo.endBal; });

    // Account details for drill-down
    const details = {
      netIncome: niRow ? [{ name: "Período ganancias", vals: niRow.slice(5).map(v => v) }] : [],
      deprec: (groups.deprec || []).map(a => ({ name: a.name, vals: a.vals.map(v => v * -1) })),
      curr_asset: (groups.curr_asset || []).map(a => ({ name: a.name, vals: a.vals.map(v => v * -1) })),
      curr_liab: (groups.curr_liab || []).map(a => ({ name: a.name, vals: a.vals.map(v => v) })),
      fixed: (groups.fixed || []).map(a => ({ name: a.name, vals: a.vals.map(v => v * -1) })),
      equity: (groups.equity || []).map(a => ({ name: a.name, vals: a.vals.map(v => v) })),
      cash: (groups.cash || []).map(a => ({ name: a.name, vals: a.vals.map(v => v) })),
    };

    return { months, details };
  }, [cm]);


  // ═══ BALANCE GENERAL ═══
  const balData=useMemo(()=>{
    if(!B||B.length===0)return null;
    const enriched=B.map(r=>({code:r[0],name:r[1],depth:r[2],section:r[3],isTotal:r[4],vals:r.slice(5),cum:bVal(r,cm),mov:r[5+cm-1]||0}));
    const totAct=enriched.find(r=>r.name==="Total Activos");
    const totPas=enriched.find(r=>r.name==="Total Pasivos");
    const totCap=enriched.find(r=>r.name==="Total Capital Contable");
    const perGan=enriched.find(r=>r.name==="Período ganancias");
    return{enriched,totAct,totPas,totCap,perGan};
  },[cm]);
  const toggleB=k=>setExpB(p=>({...p,[k]:!p[k]}));
  const bCum=(row,m)=>{let s=0;for(let i=0;i<m;i++)s+=(row.vals[i]||0);return s;};
  const renderBalRows=(section,sColor,label)=>{
    if(!balData)return null;
    const items=balData.enriched.filter(r=>r.section===section);
    const topRow=items.find(r=>r.depth===0&&!r.isTotal);
    const d1Rows=items.filter(r=>r.depth===1&&!r.isTotal);
    const rows=[];
    if(topRow)rows.push(
      <tr key={section} style={{background:`${sColor}08`,cursor:"pointer"}} onClick={()=>toggleB(section)}>
        <td style={{...td,fontWeight:600,color:sColor,position:"sticky",left:0,background:`${sColor}08`,borderBottom:`2px solid ${sColor}33`}}>
          <span style={{fontSize:8,marginRight:5}}>{expB[section]?"▼":"▶"}</span>{label||section}
        </td>
        {MO.map((m,mi)=><td key={mi} style={{...td,textAlign:"right",fontSize:10,fontWeight:500,color:bCum(topRow,mi+1)<0?"#E24B4A":bCum(topRow,mi+1)===0?"#ccc":"#1a1a2e",borderBottom:`2px solid ${sColor}33`}}>{bCum(topRow,mi+1)===0?"—":Fn(bCum(topRow,mi+1))}</td>)}
      </tr>
    );
    if(expB[section])d1Rows.forEach(d1=>{
      const d1Key=`${section}|${d1.code}`;
      const d2Rows=items.filter(r=>r.depth===2&&!r.isTotal&&items.indexOf(r)>items.indexOf(d1)&&(d1Rows.indexOf(d1)===d1Rows.length-1||items.indexOf(r)<items.indexOf(d1Rows[d1Rows.indexOf(d1)+1])));
      rows.push(
        <tr key={d1Key} style={{background:"#fafbfe",cursor:"pointer"}} onClick={()=>toggleB(d1Key)}>
          <td style={{...td,paddingLeft:20,fontWeight:500,color:"#1a1a2e",position:"sticky",left:0,background:"#fafbfe",fontSize:10}}>
            <span style={{fontSize:7,marginRight:4}}>{expB[d1Key]?"▼":"▶"}</span>{d1.name}
          </td>
          {MO.map((m,mi)=>{const v=bCum(d1,mi+1);return <td key={mi} style={{...td,textAlign:"right",fontSize:9,color:v<0?"#E24B4A":v===0?"#ddd":"#666"}}>{v===0?"":Fn(v)}</td>})}
        </tr>
      );
      if(expB[d1Key])d2Rows.forEach(d2=>{
        const d2Key=`${d1Key}|${d2.code}`;
        const allChildren=items.filter(r=>r.depth>=3&&!r.isTotal&&r.cum!==0&&items.indexOf(r)>items.indexOf(d2)&&(d2Rows.indexOf(d2)===d2Rows.length-1||items.indexOf(r)<items.indexOf(d2Rows[d2Rows.indexOf(d2)+1])));const hasD4=allChildren.some(r=>r.depth===4);const leafs=hasD4?allChildren.filter(r=>r.depth===4):allChildren.filter(r=>r.depth===3);
        rows.push(
          <tr key={d2Key} style={{background:"#f8f9fe",cursor:leafs.length?"pointer":"default"}} onClick={()=>leafs.length&&toggleB(d2Key)}>
            <td style={{...td,paddingLeft:40,fontSize:9,color:"#534AB7",fontWeight:500,position:"sticky",left:0,background:"#f8f9fe"}}>
              {leafs.length>0&&<span style={{fontSize:7,marginRight:3}}>{expB[d2Key]?"▼":"▶"}</span>}{d2.name}
            </td>
            {MO.map((m,mi)=>{const v=bCum(d2,mi+1);return <td key={mi} style={{...td,textAlign:"right",fontSize:9,color:v<0?"#E24B4A":v===0?"#eee":"#888"}}>{v===0?"":Fn(v)}</td>})}
          </tr>
        );
        if(expB[d2Key])leafs.forEach((leaf,li)=>{
          rows.push(
            <tr key={`${d2Key}|${li}`} style={{background:"#fff"}}>
              <td style={{...td,paddingLeft:60,fontSize:8,color:"#8A90A8",position:"sticky",left:0,background:"#fff"}}>{leaf.name}</td>
              {MO.map((m,mi)=>{const v=bCum(leaf,mi+1);return <td key={mi} style={{...td,textAlign:"right",fontSize:8,color:v<0?"#E24B4A":v===0?"#eee":"#aaa"}}>{v===0?"":Fn(v)}</td>})}
            </tr>
          );
        });
      });
    });
    return rows;
  };

  return (
    <div style={{ fontFamily: "'DM Mono','Consolas',monospace", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #E4E8F2", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABCAEADASIAAhEBAxEB/8QAGwAAAwEBAQEBAAAAAAAAAAAAAAcIBgEFAwT/xAA8EAABAwMDAgQCBgYLAAAAAAABAgMEBQYRAAchCBITIjFBFVEjMkJhcYIUJFJzgbQJFig4YpGSoaK1wf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/ALK1zRqXb9va799r5m7ZbUVJVLtaArw7huVvOHBkgtNKBBKTggBJBcweQ2CVVTA3P6jtuLIqCqMiZIuKuJX4fw+kIDykr9O1S8hAOeCkEqH7OsgjeXf2vp8e19g5EWOfqKq0otqUPnhfhf8AumntJtBYu2NOQxbVHb/Te3teqUgByW988rx5QcfVThP3a3ylJSkqUQAOSSfTQTcvd/qFoifHuLYNcxgfW+FyytYH4I8U/wC2tHt91N7dXJUxRK4qbZ9aCuxUWtN+Ejv90hz6o/P2E+w07kkKAKSCDyCNZDc3bSy9xqSqn3XQ48w9pSzKSOyQwfm24PMnnnHKT7gjQa9JCgCkgg+hGu6lKgVy7eme8oNpXlUZFd2wqjvg0qruAlylr9m1/JIHqj0KR3owQtGqrbWhxtLjakrQoApUk5BB9wdAkuse96lbW28e2rdUs3FdsoUqCls4cCVYDik/eQpKAfUFwEems1XLtpHSlY1nWs1aMusQ5pWqqVOO4GgZGE+IoZSe9Z57UqKcIQkZODju5CP6x9c9g0WR9JDodHcqIbPoHj4xCvx7kMn8uvU6vLm3CtunQH6HZNKuezi2o11qXFMkHByErQOUIABUHADhQ5xgBQM7a/cuzNyKR8RtOssyyhIL8ZXkkRyfZxs8jnjPKTjgnUl/0i1z3Mm+KRaYlSY9vfDUy0soUUtyHlOLSpSscK7QhIAP1ck/a1j6BbVo3pVWK/sZc8my7yaPei2qjOLalLxymHLyO8H07F8nnPaONMK1tzYt/XLTtnuo+w0v1kS0xodQ8NUd9t9eAkLCCCkL8vnbISryZTjzANN0E7oVO4KS3twq3WWYFAp7jyqm24r6RS3wUIUgjAUe9w5zz2eg509t191bJ2ypYmXVV0MvLSVR4LP0kqR6/UbBzjjHccJB9SNTHdu6KbNuGdsz03WQmNUUS1Rpc9toyHnH0EhzsC857CCC44SkAKwAMK1gKxa1k2DUnq9vdcsi9r0dPiLtqnzS4UuY4EyVk9uOAUp5HGO9Ogouw71gdUVi3lbdVs6VR6Q32tQp7jniguEKKFA9qQHWylKikEjCsE4Pm/Z0W3XVJ9jVSwLjUfjtlTTTHgVZPggqDfPv2lC0D/ChPz0dJV2bj3XBny7hs2l21Z4aR8BaixTGCR+y2g8qb7cHvwAT6ZBIT49jp+AdeN505jyRa5QW5hbHALqQz5vxyHT+Y6Dt5K+C9e9nzH/KxWbecjIWfTxEh/j/AIoH5hqkdT/1qW5VDa1C3Mt1srrNk1BM8AAnMcqSV5A9QlSG1H5J79OLby66VfFl0u6qK73wqjHDqBkEtq9Ftqx9pKgpJ+8HQKHe7pesm+y/VqAE2vcCsr8aK3+rPr9cuNDABJ+0jBySSFaS25FDrtu797D0m6pyKjXYrUBiZLS6p3xSmevt86gFKwCBkjOrm1IfVQf7YG0f72D/ADx0GJ2vo1wV/qE3wolqVBFNrUyNVGYkpTqmw0TUWs+dIKk5TkZAzzp6bI9L1k2IWKtX0oui4E4X40pr9WYX6/RtHIJH7a8nIBATpbdLIx1pbqD76n/2DerH0hHNTda6/jXX3c0hjzM0W20MOLHp3qDJx+P0iv8ASdPa/bopVl2dVLprT3hQadHU85yAVn0ShOftKUQkD3JGkv0V2/VHbfuHdG4mi3V71qCpiUkY7Y6VKKMA8gFSlkfNIQdA/wCXHYlxXYsllt9h5BbcbcSFJWkjBSQeCCDgjUovt3D0r3pLmRIM2s7SVmSHHG2iVu0l5WB7/wAEgk4WAkE9wGaz18J0SLOhvQ5sZmTGfQW3mXkBaHEEYKVJPBBHBB0HmWZdVu3lQma5bFXi1SnvDyusLz2nAPapJ5QoZGUqAI9xqXOqn++DtJ+9g/zytbW5+mZim1x65NoLwqdh1RzlcZlanIbvv29ue5Kc84PekeyRrCVTaHqAre8tkXRertCrzVBnxfEnQXm2j+jokBxSlIKUZIBPon/PQc6XBjrT3V/Gp/z7eqsvC57ftChP1y5atFpdPZHnefXgE4z2pHqpRxwlIJPsNSnB2g3+om917XfZC6HRG65NlpZnTn23f1dyR4oUlASvBPan1Trd250zir1tm49470qd9VJvzNxFrU3DazyUgZyU55wnsT80nQZQm4Oqm84qlQplG2ko0nxCXcodqzycjAx/EcHCAVc9xAFXQo0eFDZhxGGo8dhtLbTTaQlDaEjCUpA4AAAAGuU+HEp8JmDAisxYrDYbZZZbCG20AYCUpHAAHoBr76A0aNGqo0aNGgNGjRoDRo0aD//Z" alt="Saya Biologics" style={{width:42,height:42,borderRadius:10,objectFit:"cover"}} />
          <div><div style={{ fontFamily: "serif", fontSize: 20, fontWeight: 500, color: "#1a1a2e" }}>Financial Intelligence</div><div style={{ fontSize: 9, color: "#8A90A8", letterSpacing: 2, textTransform: "uppercase" }}>Rolling Forecast 2026 · Corte: {MO[cm - 1]}</div></div>
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
          <div style={{ fontSize: 11, fontWeight: 500, color: "#1a1a2e", marginBottom: 8 }}>OpEx por Clasificación — {MO[cm-1]}</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={wf} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <XAxis dataKey="name" tick={{ fontSize: 7, fill: "#8A90A8" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 7, fill: "#8A90A8" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v <= -1e6 ? `-${(Math.abs(v) / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : "0"} />
              <Tooltip formatter={v => `$${(v / 1e3).toFixed(1)}K`} contentStyle={{ fontSize: 9, borderRadius: 6 }} /><ReferenceLine y={0} stroke="#E4E8F2" />
              <Bar dataKey="start" stackId="a" fill="transparent" /><Bar dataKey="end" stackId="a" radius={[3, 3, 0, 0]}>{wf.map((e, i) => <Cell key={i} fill={e.isT ? "#534AB7" : COLORS[i % COLORS.length]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


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
            {(() => {
              const OPEX_CODE_MAP = {cogs:"COGS",sw:"Salaries & Wages",sm:"Sales & Marketing",ta:"Travel & Accomodation",pf:"Professional Fees",of:"Office Expense",qual:"Quality"};
              const toggleOx = (key) => setExpOpex(p => ({...p, [key]: !p[key]}));
              const tableRows = [];
              PL_KEYS.forEach((k) => {
                const isPct = PCT_KEYS.has(k);
                const isBold = BOLD_KEYS.has(k);
                const isOpex = OPEX_KEY_SET.has(k);
                const code = OPEX_CODE_MAP[k];
                if (k === "sw") tableRows.push(<tr key="opex-sep"><td colSpan={14} style={{ padding: "6px 6px 2px", fontSize: 9, color: "#8A90A8", letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #E4E8F2", fontWeight: 500 }}>Operating Expenses</td></tr>);
                tableRows.push(
                  <tr key={"row-"+k} style={{ background: isBold ? "#fafbfe" : "transparent", cursor: isOpex ? "pointer" : "default" }} onClick={() => isOpex && toggleOx(k)}>
                    <td style={{ ...td, fontWeight: isBold ? 500 : 400, color: isOpex ? "#534AB7" : "#1a1a2e", position: "sticky", left: 0, background: isBold ? "#fafbfe" : "#fff", fontSize: isOpex ? 9 : 10, paddingLeft: isOpex ? 16 : 6 }}>
                      {isOpex && <span style={{fontSize:8,marginRight:4}}>{expOpex[k] ? "▼" : "▶"}</span>}
                      {PL_LABELS[k]}
                    </td>
                    {plData.monthly.map((row, mi) => <td key={mi} style={{ ...td, textAlign: "right", color: isPct ? "#8A90A8" : row[k] < 0 ? "#E24B4A" : row[k] === 0 ? "#ccc" : "#1a1a2e", fontWeight: isBold ? 500 : 400, fontSize: isOpex || isPct ? 9 : 10, fontStyle: isPct ? "italic" : "normal" }}>{fv(row[k], isPct)}</td>)}
                    <td style={{ ...td, textAlign: "right", fontWeight: 500, color: isPct ? "#8A90A8" : plData.totals[k] < 0 ? "#E24B4A" : "#1a1a2e", borderLeft: "2px solid #E4E8F2", fontStyle: isPct ? "italic" : "normal" }}>{fv(plData.totals[k], isPct)}</td>
                  </tr>
                );
                // Drill-down for OpEx rows
                if (isOpex && expOpex[k] && code) {
                  const codeData = fd.filter(r => r[0] === code);
                  // Group by Clasificacion — Reales ≤ cm, Forecast > cm
                  const clsMap = {};
                  codeData.forEach(r => {
                    const m = r[2], origen = r[1];
                    if (m <= cm && origen !== "Reales") return;
                    if (m > cm && origen !== "Forecast") return;
                    const cls = r[5] || "—";
                    if (!clsMap[cls]) clsMap[cls] = { items: {}, m: Array(12).fill(0) };
                    clsMap[cls].m[m - 1] += r[8];
                    const com = r[6] || "—";
                    if (!clsMap[cls].items[com]) clsMap[cls].items[com] = { m: Array(12).fill(0), p: r[7] };
                    clsMap[cls].items[com].m[m - 1] += r[8];
                  });
                  Object.entries(clsMap).filter(([c]) => c !== "—").forEach(([cls, data]) => {
                    const clsKey = k + "|" + cls;
                    const clsExp = expOpex[clsKey];
                    const clsTotal = data.m.reduce((s, v) => s + v, 0);
                    tableRows.push(
                      <tr key={"cls-" + clsKey} style={{ background: "#fafcff", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); toggleOx(clsKey); }}>
                        <td style={{ ...td, paddingLeft: 32, fontSize: 9, color: "#185FA5", position: "sticky", left: 0, background: "#fafcff" }}>
                          <span style={{ fontSize: 7, marginRight: 3 }}>{clsExp ? "▼" : "▶"}</span>{cls}
                        </td>
                        {data.m.map((v, mi) => <td key={mi} style={{ ...td, textAlign: "right", fontSize: 9, color: v < 0 ? "#E24B4A" : v === 0 ? "#ddd" : "#666" }}>{v === 0 ? "" : F(v)}</td>)}
                        <td style={{ ...td, textAlign: "right", fontSize: 9, fontWeight: 500, borderLeft: "2px solid #E4E8F2" }}>{F(clsTotal)}</td>
                      </tr>
                    );
                    if (clsExp) {
                      Object.entries(data.items).forEach(([com, cd]) => {
                        const comTotal = cd.m.reduce((s, v) => s + v, 0);
                        tableRows.push(
                          <tr key={"com-" + clsKey + "|" + com} style={{ background: "#f8f9fe" }}>
                            <td style={{ ...td, paddingLeft: 48, fontSize: 8, color: "#8A90A8", position: "sticky", left: 0, background: "#f8f9fe" }} title={"Partner: " + cd.p}>
                              {com.length > 40 ? com.slice(0, 40) + "…" : com}
                            </td>
                            {cd.m.map((v, mi) => <td key={mi} style={{ ...td, textAlign: "right", fontSize: 8, color: v < 0 ? "#E24B4A" : v === 0 ? "#eee" : "#999" }}>{v === 0 ? "" : F(v)}</td>)}
                            <td style={{ ...td, textAlign: "right", fontSize: 8, borderLeft: "2px solid #E4E8F2" }}>{F(comTotal)}</td>
                          </tr>
                        );
                      });
                    }
                  });
                  // Show "—" items (no clasificacion)
                  if (clsMap["—"]) {
                    const noClsTotal = clsMap["—"].m.reduce((s, v) => s + v, 0);
                    if (noClsTotal !== 0) {
                      tableRows.push(
                        <tr key={"cls-" + k + "-other"} style={{ background: "#fafcff" }}>
                          <td style={{ ...td, paddingLeft: 32, fontSize: 9, color: "#8A90A8", position: "sticky", left: 0, background: "#fafcff" }}>Otros / Ajustes</td>
                          {clsMap["—"].m.map((v, mi) => <td key={mi} style={{ ...td, textAlign: "right", fontSize: 9, color: v < 0 ? "#E24B4A" : v === 0 ? "#ddd" : "#666" }}>{v === 0 ? "" : F(v)}</td>)}
                          <td style={{ ...td, textAlign: "right", fontSize: 9, fontWeight: 500, borderLeft: "2px solid #E4E8F2" }}>{F(noClsTotal)}</td>
                        </tr>
                      );
                    }
                  }
                }
              });
              return tableRows;
            })()}
          </tbody>
        </table>
      </div>

      {/* YTD + CM TABLES */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[{ t: `YTD ${MO[0]}–${MO[cm - 1]} 2026`, fk: "ytdFC", rk: "ytdRE", vk: "ytdVar", pk: "ytdVarPct", prefix: "ytd", months: ytdM },
          { t: `Mes — ${MO[cm - 1]} 2026`, fk: "cmFC", rk: "cmRE", vk: "cmVar", pk: "cmVarPct", prefix: "cm", months: [cm] }].map((t, ti) => (
          <div key={ti} style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: 12, overflowX: "auto" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#1a1a2e", marginBottom: 8 }}>{t.t}</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Línea", "Forecast", "Reales", "Var $", "Var %"].map(h => <th key={h} style={{ ...th, textAlign: h === "Línea" ? "left" : "right" }}>{h}</th>)}</tr></thead>
              <tbody>
                {(() => {
                  const OPEX_CODE_MAP = {cogs:"COGS",sw:"Salaries & Wages",sm:"Sales & Marketing",ta:"Travel & Accomodation",pf:"Professional Fees",of:"Office Expense",qual:"Quality"};
                  const tRows = [];
                  comp.forEach((r, i) => {
                    const isOpex = OPEX_KEY_SET.has(r.k);
                    const code = OPEX_CODE_MAP[r.k];
                    const expKey = t.prefix + "-" + r.k;
                    const isExp = expComp[expKey];
                    tRows.push(
                      <tr key={"r-"+i} style={{ background: r.isBold ? "#fafbfe" : "transparent", cursor: isOpex ? "pointer" : "default" }} onClick={() => isOpex && setExpComp(p => ({...p, [expKey]: !p[expKey]}))}>
                        <td style={{ ...td, fontWeight: r.isBold ? 500 : 400, fontSize: r.isPct ? 9 : 10, fontStyle: r.isPct ? "italic" : "normal", color: isOpex ? "#534AB7" : "#1a1a2e", paddingLeft: isOpex ? 16 : 6 }}>
                          {isOpex && <span style={{fontSize:8,marginRight:4}}>{isExp ? "▼" : "▶"}</span>}
                          {r.label}
                        </td>
                        <td style={{ ...td, textAlign: "right", color: r[t.fk] < 0 ? "#E24B4A" : "#185FA5", fontSize: r.isPct ? 9 : 10 }}>{fv(r[t.fk], r.isPct)}</td>
                        <td style={{ ...td, textAlign: "right", color: vc(r[t.rk]), fontSize: r.isPct ? 9 : 10 }}>{fv(r[t.rk], r.isPct)}</td>
                        <td style={{ ...td, textAlign: "right", color: vc(r[t.vk]), fontWeight: 500, fontSize: r.isPct ? 9 : 10 }}>{r.isPct ? P(r[t.vk]) : F(r[t.vk])}</td>
                        <td style={{ ...td, textAlign: "right" }}>{!r.isPct && <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 500, background: r[t.pk] < 0 ? "#FCEBEB" : r[t.pk] > 0 ? "#D4F0E6" : "#f0f2fa", color: vc(r[t.pk]) }}>{P(r[t.pk])}</span>}</td>
                      </tr>
                    );
                    // Drill-down for OpEx in comparison tables
                    if (isOpex && isExp && code) {
                      const codeData = fd.filter(row => {
                        if (row[0] !== code || !t.months.includes(row[2])) return false;
                        const m = row[2], origen = row[1];
                        if (m <= cm && origen !== "Reales") return false;
                        if (m > cm && origen !== "Forecast") return false;
                        return true;
                      });
                      const clsMap = {};
                      codeData.forEach(row => {
                        const cls = row[5] || "—";
                        if (!clsMap[cls]) clsMap[cls] = { total: 0, items: {} };
                        clsMap[cls].total += row[8];
                        const com = row[6] || "—";
                        if (!clsMap[cls].items[com]) clsMap[cls].items[com] = { total: 0, partner: row[7] };
                        clsMap[cls].items[com].total += row[8];
                      });
                      const clsExpKey = expKey + "-cls";
                      Object.entries(clsMap).filter(([c]) => c !== "—").sort((a, b) => Math.abs(b[1].total) - Math.abs(a[1].total)).forEach(([cls, data]) => {
                        const ck = clsExpKey + "|" + cls;
                        const ce = expComp[ck];
                        tRows.push(
                          <tr key={"cls2-" + ck} style={{ background: "#fafcff", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); setExpComp(p => ({...p, [ck]: !p[ck]})); }}>
                            <td style={{ ...td, paddingLeft: 28, fontSize: 9, color: "#185FA5" }}>
                              <span style={{fontSize:7,marginRight:3}}>{ce ? "▼" : "▶"}</span>{cls}
                            </td>
                            <td style={{ ...td, textAlign: "right", fontSize: 9, color: "#ccc" }}>—</td>
                            <td style={{ ...td, textAlign: "right", fontSize: 9, color: data.total < 0 ? "#E24B4A" : "#1a1a2e" }}>{F(data.total)}</td>
                            <td style={{ ...td, textAlign: "right", fontSize: 9, color: "#ccc" }}>—</td>
                            <td style={{ ...td }}></td>
                          </tr>
                        );
                        if (ce) {
                          Object.entries(data.items).sort((a, b) => Math.abs(b[1].total) - Math.abs(a[1].total)).forEach(([com, cd]) => {
                            tRows.push(
                              <tr key={"com2-" + ck + "|" + com} style={{ background: "#f8f9fe" }}>
                                <td style={{ ...td, paddingLeft: 42, fontSize: 8, color: "#8A90A8" }} title={"Partner: " + cd.partner}>
                                  {com.length > 35 ? com.slice(0, 35) + "…" : com}
                                </td>
                                <td style={{ ...td, textAlign: "right", fontSize: 8, color: "#ccc" }}>—</td>
                                <td style={{ ...td, textAlign: "right", fontSize: 8, color: cd.total < 0 ? "#E24B4A" : "#999" }}>{F(cd.total)}</td>
                                <td style={{ ...td, textAlign: "right", fontSize: 8, color: "#ccc" }}>—</td>
                                <td style={{ ...td }}></td>
                              </tr>
                            );
                          });
                        }
                      });
                      // Otros/Ajustes
                      if (clsMap["—"] && clsMap["—"].total !== 0) {
                        tRows.push(
                          <tr key={"other-" + expKey} style={{ background: "#fafcff" }}>
                            <td style={{ ...td, paddingLeft: 28, fontSize: 9, color: "#8A90A8" }}>Otros / Ajustes</td>
                            <td style={{ ...td, textAlign: "right", fontSize: 9, color: "#ccc" }}>—</td>
                            <td style={{ ...td, textAlign: "right", fontSize: 9, color: clsMap["—"].total < 0 ? "#E24B4A" : "#1a1a2e" }}>{F(clsMap["—"].total)}</td>
                            <td style={{ ...td, textAlign: "right", fontSize: 9, color: "#ccc" }}>—</td>
                            <td style={{ ...td }}></td>
                          </tr>
                        );
                      }
                    }
                  });
                  return tRows;
                })()}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* CHARTS */}
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

      {/* AREA × MONTH TABLE */}
      <div style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: 12, marginBottom: 16, overflowX: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#1a1a2e", marginBottom: 2 }}>Gasto Real por Área & Molécula — Mensual</div>
        <div style={{ fontSize: 9, color: "#8A90A8", marginBottom: 8 }}>Área → Molécula → Clasificación · Clic para expandir</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>
            <th style={{ ...th, textAlign: "left", position: "sticky", left: 0, background: "#fff", minWidth: 150 }}>Área</th>
            {ytdM.map(m => <th key={m} style={{ ...th, textAlign: "right", minWidth: 64 }}>{MO[m - 1]}</th>)}
            <th style={{ ...th, textAlign: "right", fontWeight: 500, color: "#1a1a2e", borderLeft: "2px solid #E4E8F2" }}>Total YTD</th>
          </tr></thead>
          <tbody>
            {areaTable.map((row, ri) => {
              const isExp = expArea[row.area];
              const molEntries = Object.entries(row.mols).sort((a, b) => Math.abs(b[1].total) - Math.abs(a[1].total));
              const hasDrill = molEntries.length > 0;
              return (<>
                <tr key={ri} style={{ cursor: hasDrill ? "pointer" : "default", background: ri % 2 ? "#fafbfe" : "transparent" }} onClick={() => hasDrill && toggleArea(row.area)}>
                  <td style={{ ...td, fontWeight: 500, color: "#1a1a2e", position: "sticky", left: 0, background: ri % 2 ? "#fafbfe" : "#fff", fontSize: 10 }}>
                    {hasDrill && <span style={{ fontSize: 8, marginRight: 4 }}>{isExp ? "▼" : "▶"}</span>}
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: COLORS[ri % COLORS.length], marginRight: 5, verticalAlign: "middle" }} />
                    {row.area}
                  </td>
                  {ytdM.map(m => <td key={m} style={{ ...td, textAlign: "right", fontSize: 10, color: (row.monthly[m] || 0) < 0 ? "#E24B4A" : (row.monthly[m] || 0) === 0 ? "#ccc" : "#1a1a2e" }}>{(row.monthly[m] || 0) === 0 ? "—" : F(row.monthly[m])}</td>)}
                  <td style={{ ...td, textAlign: "right", fontWeight: 500, borderLeft: "2px solid #E4E8F2", color: row.total < 0 ? "#E24B4A" : "#1a1a2e" }}>{F(row.total)}</td>
                </tr>
                {isExp && molEntries.map(([mol, mData], mi) => {
                  const molKey = `${row.area}|${mol}`;
                  const isMolExp = expArea[molKey];
                  const clsEntries = Object.entries(mData.cls).filter(([c]) => c !== "—").sort((a, b) => Math.abs(b[1].total) - Math.abs(a[1].total));
                  return (<>
                    <tr key={molKey} style={{ background: "#f5f8fc", cursor: clsEntries.length ? "pointer" : "default" }} onClick={() => clsEntries.length && toggleArea(molKey)}>
                      <td style={{ ...td, paddingLeft: 28, fontSize: 9, fontWeight: 500, color: "#185FA5", position: "sticky", left: 0, background: "#f5f8fc" }}>
                        {clsEntries.length > 0 && <span style={{ fontSize: 7, marginRight: 3 }}>{isMolExp ? "▼" : "▶"}</span>}
                        {mol}
                      </td>
                      {ytdM.map(m => <td key={m} style={{ ...td, textAlign: "right", fontSize: 9, color: (mData.monthly[m] || 0) < 0 ? "#E24B4A" : (mData.monthly[m] || 0) === 0 ? "#eee" : "#666" }}>{(mData.monthly[m] || 0) === 0 ? "" : F(mData.monthly[m])}</td>)}
                      <td style={{ ...td, textAlign: "right", fontSize: 9, fontWeight: 500, borderLeft: "2px solid #E4E8F2", color: mData.total < 0 ? "#E24B4A" : "#185FA5" }}>{F(mData.total)}</td>
                    </tr>
                    {isMolExp && clsEntries.map(([cls, cData], ci) => (
                      <tr key={`${molKey}|${ci}`} style={{ background: "#f8f9fe" }}>
                        <td style={{ ...td, paddingLeft: 48, fontSize: 8, color: "#534AB7", position: "sticky", left: 0, background: "#f8f9fe" }}>{cls}</td>
                        {ytdM.map(m => <td key={m} style={{ ...td, textAlign: "right", fontSize: 8, color: (cData.monthly[m] || 0) < 0 ? "#E24B4A" : (cData.monthly[m] || 0) === 0 ? "#eee" : "#888" }}>{(cData.monthly[m] || 0) === 0 ? "" : F(cData.monthly[m])}</td>)}
                        <td style={{ ...td, textAlign: "right", fontSize: 8, fontWeight: 500, borderLeft: "2px solid #E4E8F2", color: cData.total < 0 ? "#E24B4A" : "#534AB7" }}>{F(cData.total)}</td>
                      </tr>
                    ))}
                  </>);
                })}
              </>);
            })}
            <tr style={{ borderTop: "2px solid #E4E8F2", background: "#fafbfe" }}>
              <td style={{ ...td, fontWeight: 600, color: "#1a1a2e", position: "sticky", left: 0, background: "#fafbfe" }}>Total</td>
              {ytdM.map(m => { const t = areaTable.reduce((s, r) => s + (r.monthly[m] || 0), 0); return <td key={m} style={{ ...td, textAlign: "right", fontWeight: 500 }}>{F(t)}</td>; })}
              <td style={{ ...td, textAlign: "right", fontWeight: 600, borderLeft: "2px solid #E4E8F2" }}>{F(areaTable.reduce((s, r) => s + r.total, 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>


      {/* AREA DE TRABAJO × MONTH TABLE */}
      <div style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: 12, marginBottom: 16, overflowX: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#1a1a2e", marginBottom: 2 }}>Gasto Real por Área de Trabajo — Mensual</div>
        <div style={{ fontSize: 9, color: "#8A90A8", marginBottom: 8 }}>Clic para desglose por clasificación</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>
            <th style={{ ...th, textAlign: "left", position: "sticky", left: 0, background: "#fff", minWidth: 160 }}>Área de Trabajo</th>
            {ytdM.map(m => <th key={m} style={{ ...th, textAlign: "right", minWidth: 64 }}>{MO[m - 1]}</th>)}
            <th style={{ ...th, textAlign: "right", fontWeight: 500, color: "#1a1a2e", borderLeft: "2px solid #E4E8F2" }}>Total YTD</th>
          </tr></thead>
          <tbody>
            {plLineTable.map((row, ri) => {
              const isExp = expPL[row.pl];
              const clsEntries = Object.entries(row.cls).filter(([c]) => c !== "—").sort((a, b) => Math.abs(b[1].total) - Math.abs(a[1].total));
              const hasDrill = clsEntries.length > 0;
              return (<>
                <tr key={ri} style={{ cursor: hasDrill ? "pointer" : "default", background: ri % 2 ? "#fafbfe" : "transparent" }} onClick={() => hasDrill && togglePL(row.pl)}>
                  <td style={{ ...td, fontWeight: 500, color: "#1a1a2e", position: "sticky", left: 0, background: ri % 2 ? "#fafbfe" : "#fff", fontSize: 10 }}>
                    {hasDrill && <span style={{ fontSize: 8, marginRight: 4 }}>{isExp ? "▼" : "▶"}</span>}
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: COLORS[ri % COLORS.length], marginRight: 5, verticalAlign: "middle" }} />
                    {row.pl}
                  </td>
                  {ytdM.map(m => <td key={m} style={{ ...td, textAlign: "right", fontSize: 10, color: (row.monthly[m] || 0) < 0 ? "#E24B4A" : (row.monthly[m] || 0) === 0 ? "#ccc" : "#1a1a2e" }}>{(row.monthly[m] || 0) === 0 ? "—" : F(row.monthly[m])}</td>)}
                  <td style={{ ...td, textAlign: "right", fontWeight: 500, borderLeft: "2px solid #E4E8F2", color: row.total < 0 ? "#E24B4A" : "#1a1a2e" }}>{F(row.total)}</td>
                </tr>
                {isExp && clsEntries.map(([cls, data], ci) => (
                  <tr key={`${ri}-${ci}`} style={{ background: "#f8f9fe" }}>
                    <td style={{ ...td, paddingLeft: 30, fontSize: 9, color: "#534AB7", position: "sticky", left: 0, background: "#f8f9fe" }}>{cls}</td>
                    {ytdM.map(m => <td key={m} style={{ ...td, textAlign: "right", fontSize: 9, color: (data.monthly[m] || 0) < 0 ? "#E24B4A" : (data.monthly[m] || 0) === 0 ? "#eee" : "#666" }}>{(data.monthly[m] || 0) === 0 ? "" : F(data.monthly[m])}</td>)}
                    <td style={{ ...td, textAlign: "right", fontSize: 9, fontWeight: 500, borderLeft: "2px solid #E4E8F2", color: data.total < 0 ? "#E24B4A" : "#534AB7" }}>{F(data.total)}</td>
                  </tr>
                ))}
              </>);
            })}
            <tr style={{ borderTop: "2px solid #E4E8F2", background: "#fafbfe" }}>
              <td style={{ ...td, fontWeight: 600, color: "#1a1a2e", position: "sticky", left: 0, background: "#fafbfe" }}>Total</td>
              {ytdM.map(m => { const t = plLineTable.reduce((s, r) => s + (r.monthly[m] || 0), 0); return <td key={m} style={{ ...td, textAlign: "right", fontWeight: 500 }}>{F(t)}</td>; })}
              <td style={{ ...td, textAlign: "right", fontWeight: 600, borderLeft: "2px solid #E4E8F2" }}>{F(plLineTable.reduce((s, r) => s + r.total, 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>


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

      {/* ═══════ CASH FLOW ═══════ */}
      {cashFlow && (() => {
        const mo = cashFlow.months;
        const det = cashFlow.details;
        const cfRow = (id, label, detKey, indent, extraStyle) => {
          const hasDetail = det[detKey] && det[detKey].length > 0;
          const isExp = expCF[id];
          return (<>
            <tr style={{ cursor: hasDetail ? "pointer" : "default", ...(extraStyle||{}) }} onClick={() => hasDetail && toggleCF(id)}>
              <td style={{ ...td, paddingLeft: indent, position: "sticky", left: 0, background: (extraStyle?.background) || "#fff", fontSize: 10, fontWeight: extraStyle?.fontWeight || 400, fontStyle: extraStyle?.fontStyle || "normal" }}>
                {hasDetail && <span style={{ fontSize: 7, marginRight: 4, color: "#8A90A8" }}>{isExp ? "▼" : "▶"}</span>}
                {label}
              </td>
              {mo.slice(0, cm).map((m, mi) => { const v = m[id]; return <td key={mi} style={{ ...td, textAlign: "right", fontSize: 10, color: v < 0 ? "#E24B4A" : v === 0 ? "#ccc" : "#1a1a2e" }}>{v === 0 ? "—" : F(v)}</td> })}
              <td style={{ ...td, textAlign: "right", fontWeight: 500, borderLeft: "2px solid #E4E8F2" }}>{F(mo.slice(0, cm).reduce((s, m) => s + (m[id]||0), 0))}</td>
            </tr>
            {isExp && det[detKey].filter(a => a.vals.slice(0,cm).some(v=>v!==0)).map((a, ai) => (
              <tr key={ai} style={{ background: "#f8f9fe" }}>
                <td style={{ ...td, paddingLeft: indent + 16, fontSize: 8, color: "#8A90A8", position: "sticky", left: 0, background: "#f8f9fe" }}>{a.name}</td>
                {a.vals.slice(0, cm).map((v, mi) => <td key={mi} style={{ ...td, textAlign: "right", fontSize: 8, color: v < 0 ? "#E24B4A" : v === 0 ? "#eee" : "#999" }}>{v === 0 ? "" : F(v)}</td>)}
                <td style={{ ...td, textAlign: "right", fontSize: 8, borderLeft: "2px solid #E4E8F2", color: "#888" }}>{F(a.vals.slice(0, cm).reduce((s, v) => s + v, 0))}</td>
              </tr>
            ))}
          </>);
        };
        return (
        <div style={{ borderTop: "2px solid #E4E8F2", marginTop: 8, paddingTop: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0B6644" /><text x="16" y="18" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600" fontFamily="'Fraunces',serif" dominantBaseline="middle">CF</text></svg>
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 500, color: "#1a1a2e" }}>Cash Flow Statement</div>
              <div style={{ fontSize: 9, color: "#8A90A8", letterSpacing: 2, textTransform: "uppercase" }}>Indirect Method · {MO[0]}–{MO[cm - 1]} 2026</div>
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E4E8F2", borderRadius: 10, padding: 12, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <th style={{ ...th, textAlign: "left", position: "sticky", left: 0, background: "#fff", minWidth: 240 }}>Cash Flow</th>
                {MO.slice(0, cm).map((m, i) => <th key={i} style={{ ...th, textAlign: "right", minWidth: 80 }}>{m}</th>)}
                <th style={{ ...th, textAlign: "right", fontWeight: 500, color: "#1a1a2e", borderLeft: "2px solid #E4E8F2" }}>YTD</th>
              </tr></thead>
              <tbody>
                {/* ── OPERATING ACTIVITIES ── */}
                <tr><td colSpan={cm + 2} style={{ padding: "8px 6px 3px", fontSize: 10, fontWeight: 700, color: "#1D9E75", letterSpacing: 1, textTransform: "uppercase", borderBottom: "2px solid #1D9E7533" }}>Operating Activities</td></tr>

                {cfRow("netIncome", "Net Income (Loss)", "netIncome", 12, { fontWeight: 500 })}
                {cfRow("deprAmort", "(+) Depreciation & Amortization", "deprec", 12, { fontStyle: "italic" })}

                <tr><td colSpan={cm + 2} style={{ padding: "6px 6px 2px", fontSize: 9, color: "#8A90A8", fontStyle: "italic" }}>Changes in Working Capital</td></tr>
                {cfRow("wc_assets", "(Δ) Operating Current Assets", "curr_asset", 16)}
                {cfRow("wc_liabs", "(Δ) Operating Current Liabilities", "curr_liab", 16)}

                <tr style={{ borderTop: "2px solid #1D9E7533", background: "#f0faf6" }}>
                  <td style={{ ...td, fontWeight: 600, color: "#1D9E75", position: "sticky", left: 0, background: "#f0faf6" }}>Net Cash from Operations</td>
                  {mo.slice(0, cm).map((m, mi) => <td key={mi} style={{ ...td, textAlign: "right", fontWeight: 600, color: m.totalOp < 0 ? "#E24B4A" : "#1D9E75" }}>{F(m.totalOp)}</td>)}
                  <td style={{ ...td, textAlign: "right", fontWeight: 600, borderLeft: "2px solid #E4E8F2", color: mo.slice(0, cm).reduce((s, m) => s + m.totalOp, 0) < 0 ? "#E24B4A" : "#1D9E75" }}>{F(mo.slice(0, cm).reduce((s, m) => s + m.totalOp, 0))}</td>
                </tr>

                {/* ── INVESTING ACTIVITIES ── */}
                <tr><td colSpan={cm + 2} style={{ padding: "10px 6px 3px", fontSize: 10, fontWeight: 700, color: "#185FA5", letterSpacing: 1, textTransform: "uppercase", borderBottom: "2px solid #185FA533" }}>Investing Activities</td></tr>
                {cfRow("capex", "Capital Expenditures (CAPEX)", "fixed", 12)}

                <tr style={{ borderTop: "2px solid #185FA533", background: "#f5f8fc" }}>
                  <td style={{ ...td, fontWeight: 600, color: "#185FA5", position: "sticky", left: 0, background: "#f5f8fc" }}>Net Cash from Investing</td>
                  {mo.slice(0, cm).map((m, mi) => <td key={mi} style={{ ...td, textAlign: "right", fontWeight: 600, color: m.totalInv < 0 ? "#E24B4A" : "#185FA5" }}>{F(m.totalInv)}</td>)}
                  <td style={{ ...td, textAlign: "right", fontWeight: 600, borderLeft: "2px solid #E4E8F2", color: mo.slice(0, cm).reduce((s, m) => s + m.totalInv, 0) < 0 ? "#E24B4A" : "#185FA5" }}>{F(mo.slice(0, cm).reduce((s, m) => s + m.totalInv, 0))}</td>
                </tr>

                {/* ── FINANCING ACTIVITIES ── */}
                <tr><td colSpan={cm + 2} style={{ padding: "10px 6px 3px", fontSize: 10, fontWeight: 700, color: "#534AB7", letterSpacing: 1, textTransform: "uppercase", borderBottom: "2px solid #534AB733" }}>Financing Activities</td></tr>
                {cfRow("equityChg", "Equity Contributions", "equity", 12)}

                <tr style={{ borderTop: "2px solid #534AB733", background: "#EEEDFE" }}>
                  <td style={{ ...td, fontWeight: 600, color: "#534AB7", position: "sticky", left: 0, background: "#EEEDFE" }}>Net Cash from Financing</td>
                  {mo.slice(0, cm).map((m, mi) => <td key={mi} style={{ ...td, textAlign: "right", fontWeight: 600, color: m.totalFin < 0 ? "#E24B4A" : "#534AB7" }}>{F(m.totalFin)}</td>)}
                  <td style={{ ...td, textAlign: "right", fontWeight: 600, borderLeft: "2px solid #E4E8F2", color: mo.slice(0, cm).reduce((s, m) => s + m.totalFin, 0) < 0 ? "#E24B4A" : "#534AB7" }}>{F(mo.slice(0, cm).reduce((s, m) => s + m.totalFin, 0))}</td>
                </tr>

                {/* ── TOTALS ── */}
                <tr style={{ height: 6 }}><td colSpan={cm + 2} /></tr>
                <tr style={{ borderTop: "3px solid #1a1a2e", background: "#f0f2fa" }}>
                  <td style={{ ...td, fontWeight: 700, color: "#1a1a2e", fontSize: 11, position: "sticky", left: 0, background: "#f0f2fa" }}>Net Change in Cash</td>
                  {mo.slice(0, cm).map((m, mi) => <td key={mi} style={{ ...td, textAlign: "right", fontWeight: 700, fontSize: 11, color: m.netChange < 0 ? "#E24B4A" : "#1D9E75" }}>{F(m.netChange)}</td>)}
                  <td style={{ ...td, textAlign: "right", fontWeight: 700, fontSize: 11, borderLeft: "2px solid #E4E8F2", color: mo.slice(0, cm).reduce((s, m) => s + m.netChange, 0) < 0 ? "#E24B4A" : "#1D9E75" }}>{F(mo.slice(0, cm).reduce((s, m) => s + m.netChange, 0))}</td>
                </tr>
                <tr>
                  <td style={{ ...td, fontWeight: 500, position: "sticky", left: 0, background: "#fff" }}>Cash — Beginning Balance</td>
                  {mo.slice(0, cm).map((m, mi) => <td key={mi} style={{ ...td, textAlign: "right", fontWeight: 500 }}>{F(m.beginBal)}</td>)}
                  <td style={{ ...td, textAlign: "right", fontWeight: 500, borderLeft: "2px solid #E4E8F2" }}>{F(mo[0]?.beginBal)}</td>
                </tr>
                <tr style={{ background: "#f0faf6", borderTop: "2px solid #1D9E7533" }}>
                  <td style={{ ...td, fontWeight: 700, color: "#0B6644", fontSize: 11, position: "sticky", left: 0, background: "#f0faf6" }}>Cash — Ending Balance</td>
                  {mo.slice(0, cm).map((m, mi) => <td key={mi} style={{ ...td, textAlign: "right", fontWeight: 700, fontSize: 11, color: "#0B6644" }}>{F(m.endBal)}</td>)}
                  <td style={{ ...td, textAlign: "right", fontWeight: 700, fontSize: 11, borderLeft: "2px solid #E4E8F2", color: "#0B6644" }}>{F(mo[cm - 1]?.endBal)}</td>
                </tr>
                <tr style={{ background: "#fafbfe" }}>
                  <td style={{ ...td, fontSize: 8, color: "#8A90A8", fontStyle: "italic", position: "sticky", left: 0, background: "#fafbfe" }}>Cash per Balance Sheet (verification)</td>
                  {mo.slice(0, cm).map((m, mi) => { const diff = m.endBal - (OPEN_CASH + mo.slice(0, mi + 1).reduce((s, x) => s + x.cashActual, 0)); return <td key={mi} style={{ ...td, textAlign: "right", fontSize: 8, color: Math.abs(diff) < 10000 ? "#1D9E75" : "#E24B4A" }}>{F(OPEN_CASH + mo.slice(0, mi + 1).reduce((s, x) => s + x.cashActual, 0))}</td> })}
                  <td style={{ ...td, textAlign: "right", fontSize: 8, borderLeft: "2px solid #E4E8F2", color: "#8A90A8" }}>{F(OPEN_CASH + mo.slice(0, cm).reduce((s, m) => s + m.cashActual, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>);
      })()}


      {/* ═══════ BALANCE GENERAL ═══════ */}
      {balData&&<div style={{borderTop:"2px solid #E4E8F2",marginTop:8,paddingTop:16,marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#1a1a2e"/><text x="16" y="18" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600" fontFamily="'Fraunces',serif" dominantBaseline="middle">BG</text></svg>
          <div>
            <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:500,color:"#1a1a2e"}}>Balance Sheet</div>
            <div style={{fontSize:9,color:"#8A90A8",letterSpacing:2,textTransform:"uppercase"}}>Cumulative balances as of {MO[cm-1]} 2026</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8,marginBottom:16}}>
          {[{l:"TOTAL ASSETS",v:balData.totAct?.cum,c:"#1D9E75",mov:balData.totAct?.mov},{l:"TOTAL LIABILITIES",v:balData.totPas?.cum,c:"#E24B4A",mov:balData.totPas?.mov},{l:"EQUITY",v:balData.totCap?.cum,c:"#534AB7",mov:balData.totCap?.mov},{l:"NET INCOME (LOSS)",v:balData.perGan?.cum,c:balData.perGan?.cum<0?"#E24B4A":"#1D9E75",mov:balData.perGan?.mov}].map((k,i)=>(
            <div key={i} style={{background:"#fff",border:"1px solid #E4E8F2",borderRadius:10,padding:"10px 14px",borderTop:`3px solid ${k.c}`}}>
              <div style={{fontSize:7,color:"#8A90A8",letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>{k.l}</div>
              <div style={{fontSize:18,fontWeight:500,color:k.v<0?"#E24B4A":"#1a1a2e",fontFamily:"'Fraunces',serif"}}>{Fn(k.v)}</div>
              <div style={{fontSize:8,color:"#8A90A8",marginTop:2}}>Mov {MO[cm-1]}: <span style={{color:k.mov<0?"#E24B4A":"#1D9E75",fontWeight:500}}>{Fn(k.mov)}</span></div>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",border:"1px solid #E4E8F2",borderRadius:10,padding:12,overflowX:"auto"}}>
          <div style={{fontSize:11,fontWeight:500,color:"#1a1a2e",marginBottom:4}}>Balance Sheet — Detail</div>
          <div style={{fontSize:9,color:"#8A90A8",marginBottom:8}}>Monthly cumulative balances · Click to expand</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
            <th style={{...th,textAlign:"left",position:"sticky",left:0,background:"#fff",minWidth:160}}>Cuenta</th>
            {MO.map((m,i)=><th key={i} style={{...th,textAlign:"right",minWidth:64,color:i+1<=cm?"#085041":"#999",background:i+1<=cm?"#f0faf6":"#fafafa"}}>{m}</th>)}
          </tr></thead>
          <tbody>
            {renderBalRows("Activos","#1D9E75","Assets")}
            {renderBalRows("Pasivos","#E24B4A","Liabilities")}
            {renderBalRows("Capital","#534AB7","Equity")}
            <tr style={{borderTop:"2px solid #E4E8F2",background:"#fafbfe"}}>
              <td style={{...td,fontSize:9,color:"#8A90A8",fontStyle:"italic",position:"sticky",left:0,background:"#fafbfe"}}>A − L − E</td>
              {MO.map((m,mi)=>{const a=balData.totAct?bVal([0,0,0,0,0,...balData.totAct.vals],mi+1):0;const p=balData.totPas?bVal([0,0,0,0,0,...balData.totPas.vals],mi+1):0;const c=balData.totCap?bVal([0,0,0,0,0,...balData.totCap.vals],mi+1):0;const d=a-p-c;return <td key={mi} style={{...td,textAlign:"right",fontSize:9,fontWeight:500,color:Math.abs(d)<10000?"#1D9E75":"#E24B4A"}}>{Math.abs(d)<10000?"✓":Fn(d)}</td>})}
            </tr>
          </tbody></table>
        </div>
      </div>}



      <div style={{ textAlign: "center", fontSize: 8, color: "#B0B6CC", padding: "12px 0", marginTop: 8 }}>Saya Biologics — Financial Intelligence · P&L + Balance General · 2026</div>
    </div>
  );
}
