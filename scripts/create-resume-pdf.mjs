import fs from "node:fs";
import path from "node:path";

function createPdf() {
  const lines = [
    "BT",
    "/F1 20 Tf",
    "50 760 Td",
    "(Kunal Khuteta - Full Stack AI Developer) Tj",
    "0 -24 Td",
    "/F2 10 Tf",
    "(Email: kunalkhandelwal.dev@gmail.com | Location: Jaipur, India / Remote) Tj",
    "0 -14 Td",
    "(GitHub: https://github.com/Kunalkhuteta | LinkedIn: https://linkedin.com/in/kunal-khandelwal) Tj",
    "0 -28 Td",
    "/F1 13 Tf",
    "(PROFESSIONAL SUMMARY) Tj",
    "0 -16 Td",
    "/F2 10 Tf",
    "(Full-stack software and mobile developer focused on scalable applications, GenAI) Tj",
    "0 -13 Td",
    "(and agentic automation tools, and developer infrastructure. Experienced in production) Tj",
    "0 -13 Td",
    "(deployments across React, Angular, Flutter, C# ASP.NET Core, FastAPI, and Docker.) Tj",
    "0 -24 Td",
    "/F1 13 Tf",
    "(EXPERIENCE) Tj",
    "0 -16 Td",
    "/F1 11 Tf",
    "(SoftTrade InfoTech - Full Stack Developer \\(Apr 2026 - Present\\)) Tj",
    "0 -14 Td",
    "/F2 10 Tf",
    "(- Architecting distributed systems, GenAI workflows, and event-driven microservices.) Tj",
    "0 -13 Td",
    "(- Building resilient API layers and leading full-stack product deliveries.) Tj",
    "0 -18 Td",
    "/F1 11 Tf",
    "(SoftTrade InfoTech - Software Engineer Intern \\(Jan 2026 - Mar 2026\\)) Tj",
    "0 -14 Td",
    "/F2 10 Tf",
    "(- Delivered frontend modules in Angular and backend services in ASP.NET Core.) Tj",
    "0 -24 Td",
    "/F1 13 Tf",
    "(CORE SKILLS & TECHNOLOGIES) Tj",
    "0 -16 Td",
    "/F2 10 Tf",
    "(- Languages: C#, TypeScript, JavaScript, Python, Dart, Java, C++, SQL) Tj",
    "0 -13 Td",
    "(- Backend & Cloud: ASP.NET Core, Node.js, Express, FastAPI, Docker, Kubernetes, CI/CD) Tj",
    "0 -13 Td",
    "(- Frontend & Mobile: React 19, Angular, Flutter, Tailwind CSS, Radix UI, GSAP) Tj",
    "0 -13 Td",
    "(- AI & Agentic: GenAI Workflows, LLM Function Calling, Multi-agent Orchestration) Tj",
    "0 -13 Td",
    "(- Databases: PostgreSQL, MongoDB, Redis, InfluxDB) Tj",
    "0 -24 Td",
    "/F1 13 Tf",
    "(ACHIEVEMENTS & MILESTONES) Tj",
    "0 -16 Td",
    "/F2 10 Tf",
    "(- Winner: GDG 15-Hour Hackathon \\(Built working product with 10k+ LOC\\)) Tj",
    "ET",
  ];

  const content = lines.join("\n");
  const streamBuf = Buffer.from(content, "utf-8");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>",
    `<< /Length ${streamBuf.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const outPath = path.resolve("public/resume.pdf");
  fs.writeFileSync(outPath, pdf);
  console.log(`Successfully created ${outPath} (${pdf.length} bytes)`);
}

createPdf();
