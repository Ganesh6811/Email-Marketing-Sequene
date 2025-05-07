import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Agenda from "agenda";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "https://email-marketing-sequene-frontend.onrender.com",
    methods: ["GET", "POST"],
  })
);


// Creating agenda working processes
const agenda = new Agenda({
  db: {
    address: process.env.MONGO_DB_URL,
    collection: "agendaJobs",
  },
});

agenda.define("sendEmail", async (job) => {
  const { from, pass, to, subject, text } = job.attrs.data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: from, pass },
  });

  await transporter.sendMail({
    from: `"Email Scheduler" <${from}>`,
    to,
    subject,
    text,
  });

  console.log(`Email sent from ${from} to ${to}`);
});


// Constructing the flow chains
const flowChains = (nodes, edges) => {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

 
  const outEdges = {};
  for (const edge of edges) {
    if (!outEdges[edge.source]) {
      outEdges[edge.source] = [];
    }
    outEdges[edge.source].push(edge);
  }

  const visited = new Set();
  const sequences = [];

  for (const node of nodes) {
    if (node.type === "LeadSource" && !visited.has(node.id)) {
      const sequence = [];
      const queue = [node.id];

      while (queue.length > 0) {
        const currentId = queue.shift();
        if (visited.has(currentId)) continue;

        visited.add(currentId);
        sequence.push(nodeMap[currentId]);

        const children = outEdges[currentId] || [];
        for (const edge of children) {
          queue.push(edge.target);
        }
      }

      sequences.push(sequence);
    }
  }

  return sequences;
};

// Post request for getting the data
app.post("/schedule-emails", async (req, res) => {
  try {
    const { nodes, edges } = req.body;
    console.log("Got the data from the client")
    const flows = flowChains(nodes, edges);

    for (const sequence of flows) {
      let waitMinutes = 0;
      let strTime = "";  
      let senderEmail = "";
      let senderPass = "";

      for (const node of sequence) {
        switch (node.type) {
          case "LeadSource":
            senderEmail = node.data.senderEmail;
            senderPass = node.data.password;
            break;

          case "WaitDelay":
            waitMinutes += parseInt(node.data.numTime || 0);
            strTime = node.data.strTime || ""; 
            break;

          case "ColdEmail":
            const scheduleTime = strTime ? `in ${waitMinutes} minutes ${strTime}` : `in ${waitMinutes} minutes`;

            await agenda.schedule(scheduleTime, "sendEmail", {
              from: senderEmail,
              pass: senderPass,
              to: node.data.to,
              subject: node.data.subject,
              text: node.data.message,
            });
            break;
        }
      }
    }

    res.status(200).json({ message: "Email sequence is working" });
  } catch (err) {
    console.error("Error in email sheduling", err);
    res.status(500).json({ error: "Failed in email sheduling process." });
  }
});


(async function () {
  await agenda.start();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
