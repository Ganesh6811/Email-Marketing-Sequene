import { Handle, Position } from "@xyflow/react"; 

import 'bootstrap/dist/css/bootstrap.min.css';
import { BsPersonFillAdd } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdStopwatch } from "react-icons/io";

//AddLeadSource(Temporary starting point)
const AddLeadSource = ({ id, data }) => {
    return (
        <div
            className="text-center p-2 border rounded bg-light"
            style={{
                width: '250px',
                height:"100px",
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontFamily: 'Arial, sans-serif',
            }}
            onClick={() => data.onclick(id)}
        >
            <p className="m-0 fs-4">+</p>
            <p className="m-0 fw-bold">Add Lead Source</p>
            <p className="m-0 text-muted small">
                Click to add leads from List or CRM
            </p>

            <Handle type="source" position={Position.Bottom} style={{ background: 'white' }} />
        </div>
    );
};


//Lead Source node
const LeadSource = ({data}) => { 
    return (
        <div className="d-flex  gap-4 justifi-content-center align-items-center p-3" style={{border:"2px solid black", borderRadius:"15px", backgroundColor:"#fdfdfd", height:"120px", width:"200px"}}>
            
              <BsPersonFillAdd style={{height:"50px", width:"45px", color:"#c23b60", border:"1px solid black", borderRadius:"15px", backgroundColor:"#f3a4b5i"}}/>
           
            <div>
                <strong>Leads from </strong>
                <p style={{color:"#c23b60"}}>{data.templateHeading}</p>
            </div>

            <Handle type="source" position={Position.Bottom} style={{ background: '#28a745' }} />
        </div>
      );
      
}


//Temporary Add node(choice) with symbol (+)
const TempAddNode = ({id, data}) => {
    return (
        <div onClick={()=>data.onclick(id)}>
            <div className="" style={{borderRadius:"5px", border:"2px solid blue", height:"30px", width:"30px", textAlign:"center"}}>
                +
            </div>

            <Handle type="target" position={Position.Top} /> 
        </div>
    )
}


//Displaying Mail data
const ColdEmail = ({ data }) => {
    return (
        <div className="d-flex  gap-4 justifi-content-center align-items-center p-3" style={{border:"2px solid black", borderRadius:"15px", backgroundColor:"#fdfdfd", height:"120px", width:"200px"}}>
            <div>
              <MdOutlineEmail  style={{height:"50px", width:"45px", color:"#c23b60", border:"1px solid black", borderRadius:"10px", backgroundColor:"#f3a4b5i"}} />
            </div>
            <div>
                <strong>Email</strong> 
                <p className="text-break text-danger mb-0">{data.to}</p>
            </div>

            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    )
}


//Displaying Waiting data
const WaitDelay = ({ data }) => {
    return (
        <div className="d-flex  gap-4 justifi-content-center align-items-center p-3" style={{border:"2px solid black", borderRadius:"15px", backgroundColor:"#fdfdfd", height:"120px", width:"200px"}}>
            <div>
              <IoMdStopwatch  style={{height:"50px", width:"45px", color:"#c23b60", border:"1px solid black", borderRadius:"10px", backgroundColor:"#f3a4b5i"}} />
            </div>
            <div>
                <strong>Waiting Time</strong> 
                <p style={{color:"#c23b60"}}>Time:{data.numTime}  {data.strTime}</p>
            </div>

            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    )
}


export { LeadSource, ColdEmail, WaitDelay, AddLeadSource, TempAddNode };