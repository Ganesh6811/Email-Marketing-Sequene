import { ReactFlow, Controls, Panel } from '@xyflow/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@xyflow/react/dist/style.css';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LeadSource, ColdEmail, WaitDelay, AddLeadSource, TempAddNode } from './Components/CustomNode.jsx';
import axios from "axios";
import base_url from './config.jsx';
import Modal from "react-modal";

Modal.setAppElement('#root');

const nodeTypes = {
  ColdEmail: ColdEmail,
  LeadSource: LeadSource,
  WaitDelay: WaitDelay,
  AddLeadSource: AddLeadSource,
  TempAddNode: TempAddNode,
};

const App = () => {

  const [xposition, setXposition] = useState(100);
  const [yposition, setYposition] = useState(100);


  const [showLead, setShowLead] = useState(false);
  const [showColdWait, setShowColdWait] = useState(false);
  const [showColdMessage, setShowColdMessage] = useState(false);
  const [showWait, setShowWait] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [tempId, setTempId] = useState("");
  const [templateHeading, setTemplateHeading] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [pass, setPass] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [timeNum, setTimeNum] = useState("");
  const [timeStr, setTimeStr] = useState("");

  const [nodes, setNodes] = useState([{
    id: `add-lead-${uuidv4()}`,
    type: "AddLeadSource",
    position: { x: xposition, y: yposition },
    data: { onclick: (id) => handleAddLeadSourceOnclick(id) },
  }]);
  const [edges, setEdges] = useState([]);



  // Adding and updating the Lead source
  const handleAddLeadSourceOnclick = (id) => {
    console.log("Show Lead source clicked.");
    setShowLead(true);
    setLeadId(id);
  }

  const onSubmitAddLeadSource = (id) => {
    let prevYposition;
    let updatedNodes = nodes.map((node) => {
      if (node.id === id) {
        prevYposition = node.position.y;
        return {
          ...node,
          type: "LeadSource",
          data: {
            senderEmail: leadEmail,
            password: pass,
            templateHeading,
          }
        };
      }
      return node;
    });

    setLeadEmail("");
    setPass("");
    setTemplateHeading("");
    setLeadId("");

    const newYPosition = prevYposition + 200;
    const newNode = {
      id: `add-lead-${uuidv4()}`,
      type: "TempAddNode",
      position: { x: xposition, y: newYPosition },
      data: { onclick: (id) => handleAddColdWait(id) },
    };


    updatedNodes = [...updatedNodes, newNode];
    setNodes(updatedNodes);

    setEdges((ed) => [...ed,
    {
      id: `add-node-${uuidv4()}`,
      source: id,
      target: newNode.id,
    }
    ]);


    const newXposition = xposition + 400;
    const newAddLead = {
      id: `add-lead-${uuidv4()}`,
      type: "AddLeadSource",
      position: { x: newXposition, y: 100 },
      data: { onclick: (id) => handleAddLeadSourceOnclick(id) },
    }

    setNodes((nds) => {
      return [...nds, newAddLead];
    });

    setXposition(newXposition);
  };



  // Adding and updating the + with the "wait" and Cold nodes
  const handleAddColdWait = (id) => {
    console.log("Show Add Cold and wait clicked.");
    setShowColdWait(true);
    setTempId(id);
  }

  // Adding the cold Message
  const onSubmitColdMessage = (id) => {

    let prevXposition, prevYposition;
    let updatedNodes = nodes.map((node) => {
      if (node.id === id) {
        prevXposition = node.position.x;
        prevYposition = node.position.y;
        return {
          ...node,
          type: "ColdEmail",
          data: {
            to,
            subject,
            message,
          }
        };
      }
      return node;
    });

    setTo("");
    setSubject("");
    setMessage("");
    setTempId("");

    const newYPosition = prevYposition + 200;
    const newNode = {
      id: `add-lead-${uuidv4()}`,
      type: "TempAddNode",
      position: { x: prevXposition, y: newYPosition },
      data: { onclick: (id) => handleAddColdWait(id) },
    };

    

    updatedNodes = [...updatedNodes, newNode];
    setNodes(updatedNodes);

    setEdges((ed) => [...ed,
    {
      id: `add-node1-${uuidv4()}`,
      source: id,
      target: newNode.id,
    }
    ]);

  }


  // Adding Wait Message
  const onSubmitWaitMessage = (id) => {
    let prevXposition, prevYposition;
    let updatedNodes = nodes.map((node) => {
      if (node.id === id) {
        prevXposition = node.position.x;
        prevYposition = node.position.y;
        return {
          ...node,
          type: "WaitDelay",
          data: {
             numTime:timeNum,
             strTime:timeStr,
          }
        };
      }
      return node;
    });

    setTimeNum("");
    setTimeStr("");
    setTempId("");

    const newYPosition = prevYposition + 200;
    const newNode = {
      id: `add-lead-${uuidv4()}`,
      type: "TempAddNode",
      position: { x: prevXposition, y: newYPosition },
      data: { onclick: (id) => handleAddColdWait(id) },
    };


    updatedNodes = [...updatedNodes, newNode];
    setNodes(updatedNodes);

    setEdges((ed) => [...ed,
    {
      id: `add-node1-${uuidv4()}`,
      source: id,
      target: newNode.id,
    }
    ]);

  }


  // sending data to the post request
  const sendData = async()=>{
    try{
      await axios.post(`${base_url}/schedule-emails`, {nodes, edges});
      alert("Sheduling the mails successfully");
    }
    catch(err){
      console.log("Error sending data to the backend API:", err);
    }
  }

  return (
    <div id='root'>

      {/* Header */}
      <div className='d-flex justify-content-between mt-4 mx-4'>
        <h2>Create Your Own Shedule</h2>
        <button className='text-white' style={
          {
            borderRadius: "20px",
            width: "150px",
            background: "blue"
          }
        }
        onClick={()=>sendData()}>Save & Shedule</button>
      </div>


      {/* Displaying the sheduling Visually */}
      <div className='mx-5 mt-5 mb-5'
        style={
          {
            height: "100vh",
            borderRadius: "10px",
            backgroundColor: '#dedede'
          }
        }>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          zoomOnScroll={false}
          panOnScroll={false}
          nodeTypes={nodeTypes}
        >

          <Controls
            showZoom={true}
            showFitView={true}
            position='bottom-left'
          />
          <Panel />
        </ReactFlow>
      </div>


      {/* Displaying Lead source popUp */}
      <Modal isOpen={showLead} onRequestClose={() => setShowLead(false)}
        style={{
          content: {
            maxWidth: '30%',
            height: "60%",
            margin: 'auto',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: '#f9f9f9',
            fontFamily: 'Segoe UI, sans-serif'
          }
        }}
      >
        <div className='d-flex flex-column align-items-center gap-3'>
          <h4 className='text-center mb-4 text-primary'>Add Lead Source</h4>
          <div>
            <label className='form-group mb-3'>Template Name:</label>
            <input type='input' placeholder='Enter the template name.....' className='form-control' onChange={(e) => setTemplateHeading(e.target.value)} />
          </div>
          <div>
            <label className='form-group mb-3'>Email:</label>
            <input type='input' placeholder='Enter the mail.....' className='form-control' onChange={(e) => setLeadEmail(e.target.value)} />
          </div>
          <div>
            <label className='form-group mb-3'>Password:</label>
            <input type='input' placeholder='Enter the password.....' className='form-control' onChange={(e) => setPass(e.target.value)} />
          </div>
          <button className='text-center' style={{backgroundColor:"blue", color:"white", borderRadius:"5px", padding:"5px", width:"65px", alignItems:"center"}}  onClick={() => { setShowLead(false); onSubmitAddLeadSource(leadId) }}>save</button>
        </div>

      </Modal>


      {/* Displaying the cold and wait choice */}
      <Modal isOpen={showColdWait} onRequestClose={() => setShowColdWait(false)}
        style={{
          content: {
            maxWidth: '30%',
            height: "40%",
            margin: 'auto',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: '#f9f9f9',
            fontFamily: 'Segoe UI, sans-serif',
          }
        }}
      >
        <div className='d-flex  gap-5 flex-column align-items-center'>
          <h4 className='text-center mb-4 text-primary fs-3'>Select your choice:</h4>

          <div className='d-flex gap-4 justify-content-center my-3'>
            <div
              style={{
                border: "2px solid #0d6efd",
                textAlign: "center",
                minWidth: "120px",
                padding: "12px 20px",
                borderRadius: "10px",
                backgroundColor: "#e9f3ff",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                cursor:"pointer"
              }}

              onClick={() => { setShowColdMessage(true); setShowColdWait(false) }}
            >
              <p className='text-primary fw-semibold m-0'>📧 Cold Mail</p>
            </div>

            <div
              style={{
                border: "2px solid #0d6efd",
                textAlign: "center",
                minWidth: "120px",
                padding: "12px 20px",
                borderRadius: "10px",
                backgroundColor: "#e9f3ff",
                cursor:"pointer"
              }}

              onClick={() => { setShowWait(true); setShowColdWait(false) }}
            >
              <p className='text-primary fw-semibold m-0'>⏱️ Wait / Delay</p>
            </div>
          </div>
        </div>
      </Modal>


      {/* Displaying Cold Message Data PopUp */}
      <Modal isOpen={showColdMessage} onRequestClose={() => setShowColdMessage(false)}
        style={{
          content: {
            maxWidth: '30%',
            height: "60%",
            margin: 'auto',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: '#f9f9f9',
            fontFamily: 'Segoe UI, sans-serif'
          }
        }}
      >
        <div className='d-flex flex-column align-items-center gap-3'>
          <h4 className='text-center mb-4 text-primary'>Cold Mail</h4>
          <div>
            <label className='form-group mb-3'>To:</label>
            <input type='input' placeholder='Enter the email.....' className='form-control' onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <label className='form-group mb-3'>Subject:</label>
            <input type='input' placeholder='Enter the subject.....' className='form-control' onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <label className='form-group mb-3'>Message:</label>
            <input type='input' placeholder='Enter the message.....' className='form-control' onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button className='text-center' style={{backgroundColor:"blue", color:"white", borderRadius:"5px", padding:"5px", width:"65px", alignItems:"center"}} onClick={() => { setShowColdMessage(false); onSubmitColdMessage(tempId) }}>save</button>
        </div>

      </Modal>


      {/* Displaying the Wait/Delay popUp message */}
      <Modal isOpen={showWait} onRequestClose={() => setShowWait(false)}
        style={{
          content: {
            maxWidth: '30%',
            height: "60%",
            margin: 'auto',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: '#f9f9f9',
            fontFamily: 'Segoe UI, sans-serif'
          }
        }}
      >
        <div className='d-flex flex-column  gap-3'>
          <h4 className='text-center mb-4 text-primary'>WAIT/DELAY MESSAGE</h4>
          <div className='d-flex flex-column '>
            <label className='form-group mb-3'>Time:</label>
            <input type='input' placeholder='Enter the Delay Time.....' className='form-control' onChange={(e) => setTimeNum(e.target.value)} />
          </div>
          <div className='d-flex flex-column justify-content-start'>
            <label className='form-group mb-3'>Enter time in month's, hours, minutes...:</label>
            <input type='input' placeholder='Enter the Delay Time in months, days, hours.....' className='form-control' onChange={(e) => setTimeStr(e.target.value)} />
          </div>
          <button className='text-center' style={{backgroundColor:"blue", color:"white", borderRadius:"5px", padding:"5px", width:"65px", alignItems:"center"}} onClick={() => { setShowWait(false); onSubmitWaitMessage(tempId) }}>save</button>
        </div>

      </Modal>


    </div>
  )
}

export default App;

